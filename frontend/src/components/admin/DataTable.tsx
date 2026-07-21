import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Edit, Trash2 } from "lucide-react";

interface Column {
  key: string;
  header: string;
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onBulkDelete?: (ids: (string | number)[]) => void;
}

export function DataTable({ columns, data, onEdit, onDelete, onBulkDelete }: DataTableProps) {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const currentData = data.slice(startIndex, endIndex);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(data.map((row) => row.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string | number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      
      {/* Bulk Actions Bar (Visible only when items are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {selectedIds.length} item(s) selected
          </span>
          <button 
            onClick={() => onBulkDelete && onBulkDelete(selectedIds)}
            className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  checked={selectedIds.length === data.length && data.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              {columns.map((col) => (
                <th key={col.key} scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
              <th scope="col" className="relative px-6 py-4 w-24">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => handleSelectOne(row.id)}
                  />
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    {onEdit && (
                      <button onClick={() => onEdit(row.id)} className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-6 py-12 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.length > 0 && (
        <div className="bg-[#fdfdff] px-4 py-3 border-t border-[#f3f4f6] flex items-center justify-between sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-[13px] text-[#6c757d]">
                Showing <span className="font-bold text-[#191d21]">{startIndex + 1}</span> to <span className="font-bold text-[#191d21]">{endIndex}</span> of <span className="font-bold text-[#191d21]">{data.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-1.5 rounded-l border border-[#e4e6fc] bg-white text-[13px] font-medium text-[#6c757d] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-3.5 py-1.5 border text-[13px] font-medium transition-colors ${
                      currentPage === page 
                        ? "border-[#6777ef] bg-[#6777ef] text-white z-10 shadow-[0_2px_6px_rgba(103,119,239,0.4)]" 
                        : "border-[#e4e6fc] bg-white text-[#6c757d] hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-1.5 rounded-r border border-[#e4e6fc] bg-white text-[13px] font-medium text-[#6c757d] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
