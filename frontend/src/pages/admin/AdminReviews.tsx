import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/PageHeader";
import { supabase } from "@/lib/supabase";
import { Star, CheckCircle, XCircle, Trash2, MessageSquare, Search } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_approved: boolean;
  is_verified_purchase: boolean;
  created_at: string;
  profile: { first_name: string | null; last_name: string | null } | null;
  product: { title: string } | null;
}

async function fetchAllReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id, rating, title, comment, is_approved, is_verified_purchase, created_at,
      profile:profiles(first_name, last_name),
      product:products(title)
    `)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Review[];
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}

export function AdminReviews() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");

  const { data: reviews = [], isLoading, isError } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: fetchAllReviews,
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: approved })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const filtered = reviews.filter((r) => {
    const matchSearch =
      !search ||
      r.product?.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase()) ||
      `${r.profile?.first_name} ${r.profile?.last_name}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "approved" && r.is_approved) ||
      (filter === "pending" && !r.is_approved);
    return matchSearch && matchFilter;
  });

  const stats = {
    total: reviews.length,
    approved: reviews.filter((r) => r.is_approved).length,
    pending: reviews.filter((r) => !r.is_approved).length,
    avgRating: reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—",
  };

  return (
    <div>
      <PageHeader
        title="Reviews"
        description="Moderate and manage customer product reviews."
        showExport
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Reviews", value: stats.total, color: "text-gray-900" },
          { label: "Approved", value: stats.approved, color: "text-green-700" },
          { label: "Pending", value: stats.pending, color: "text-yellow-700" },
          { label: "Avg Rating", value: stats.avgRating, color: "text-blue-700" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 mb-4 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, customer or content..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "approved", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                filter === f ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-500">Failed to load reviews.</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500">No reviews found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {["Customer", "Product", "Rating", "Review", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filtered.map((review) => {
                  const prof: any = Array.isArray(review.profile) ? review.profile[0] : review.profile;
                  const author = prof
                    ? `${prof.first_name || ""} ${prof.last_name || ""}`.trim() || "Anonymous"
                    : "Anonymous";
                  const prod: any = Array.isArray(review.product) ? review.product[0] : review.product;
                  return (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{author}</td>
                      <td className="px-5 py-4 text-sm text-gray-600 max-w-[140px] truncate">{prod?.title || "—"}</td>
                      <td className="px-5 py-4">
                        <StarDisplay rating={review.rating} />
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 max-w-[200px]">
                        {review.title && <p className="font-semibold text-gray-800 truncate">{review.title}</p>}
                        <p className="truncate text-xs">{review.comment || "—"}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            review.is_approved
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {review.is_approved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(review.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          {review.is_approved ? (
                            <button
                              onClick={() => approveMutation.mutate({ id: review.id, approved: false })}
                              title="Reject"
                              className="p-1.5 rounded-md text-yellow-600 hover:bg-yellow-50 transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => approveMutation.mutate({ id: review.id, approved: true })}
                              title="Approve"
                              className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm("Delete this review permanently?")) deleteMutation.mutate(review.id);
                            }}
                            title="Delete"
                            className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
