import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare } from "lucide-react";
import { fetchProductReviews } from "@/lib/api";

interface ReviewsListProps {
  productId: string;
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex text-accent">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4"
          fill={i < Math.round(rating) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export function ReviewsList({ productId }: ReviewsListProps) {
  const { data: reviews = [], isLoading, isError } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => fetchProductReviews(productId),
    enabled: !!productId,
  });

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="mt-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-border pb-6">
        <div>
          <h3 className="text-2xl font-bold uppercase tracking-tight">Customer Reviews</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-4 mt-3">
              <StarRating rating={avgRating} />
              <span className="text-muted-foreground font-medium text-sm">
                {avgRating.toFixed(1)} out of 5 based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
        <Button variant="outline" className="mt-4 md:mt-0 uppercase tracking-widest text-xs h-10 px-6 rounded-none">
          Write a Review
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="pb-8 border-b border-border space-y-2 animate-pulse">
              <div className="h-4 bg-muted rounded w-32" />
              <div className="h-3 bg-muted rounded w-24" />
              <div className="h-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p>Failed to load reviews.</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <h4 className="font-semibold text-foreground mb-1">No Reviews Yet</h4>
          <p className="text-sm">Be the first to share your experience with this product.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {reviews.map((review) => {
            const authorName = review.profile
              ? `${review.profile.first_name || ""} ${review.profile.last_name?.charAt(0) || ""}.`.trim()
              : "Anonymous";
            const date = new Date(review.created_at).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            });
            return (
              <div key={review.id} className="pb-8 border-b border-border last:border-0">
                <div className="flex justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    {review.profile?.avatar_url ? (
                      <img
                        src={review.profile.avatar_url}
                        alt={authorName}
                        className="w-8 h-8 rounded-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        {authorName.charAt(0)}
                      </div>
                    )}
                    <span className="font-bold">{authorName}</span>
                    {review.is_verified_purchase && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-sm font-medium">
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{date}</span>
                </div>
                <StarRating rating={review.rating} />
                {review.title && <h4 className="font-bold text-lg mt-2 mb-1">{review.title}</h4>}
                {review.comment && <p className="text-muted-foreground leading-relaxed">{review.comment}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
