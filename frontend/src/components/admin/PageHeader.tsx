import { Plus, Download, FileText, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  showExport?: boolean;
}

export function PageHeader({ title, description, primaryAction, showExport }: PageHeaderProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>

      <div className="mt-4 sm:mt-0 flex space-x-3">
        {showExport && (
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            
            <AnimatePresence>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1"
                  >
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                      <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                      Export as Excel
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-red-600" />
                      Export as PDF
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {primaryAction && (
          <Link
            to={primaryAction.href}
            className="inline-flex items-center px-4 py-2 bg-black border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-800 shadow-sm transition-colors uppercase tracking-widest"
          >
            <Plus className="h-4 w-4 mr-2" />
            {primaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
}
