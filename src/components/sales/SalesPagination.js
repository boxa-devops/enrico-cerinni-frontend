import { Button } from '../ui';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function SalesPagination({ 
  pagination, 
  onPageChange, 
  onPageSizeChange 
}) {
  const generatePageNumbers = () => {
    const pages = [];
    const currentPage = pagination.page;
    const totalPages = pagination.pages;
    
    // Always show first page
    pages.push(1);
    
    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    if (start > 2) {
      pages.push('...');
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if there are more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (pagination.pages <= 1) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            {pagination.total > 0 ? (
              <>
                {pagination.total} ta natija
              </>
            ) : (
              'Natija topilmadi'
            )}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="text-sm text-gray-600 font-medium">
          {pagination.total > 0 ? (
            <>
              {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} 
              dan {pagination.total} ta
            </>
          ) : (
            'Natija topilmadi'
          )}
        </span>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sahifada:</span>
          <select
            value={pagination.limit}
            onChange={(e) => onPageSizeChange(e.target.value)}
            className={cn(
              "px-3 py-1.5 text-sm border-2 border-gray-200 rounded-lg bg-white",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              "transition-colors duration-200"
            )}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={pagination.page === 1}
          onClick={() => onPageChange(1)}
          title="Birinchi sahifa"
          className="p-2"
        >
          <ChevronsLeft size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          disabled={pagination.page === 1}
          onClick={() => onPageChange(pagination.page - 1)}
          title="Oldingi sahifa"
          className="p-2"
        >
          <ChevronLeft size={16} />
        </Button>
        
        <div className="flex items-center gap-1">
          {generatePageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={page === pagination.page ? "default" : "ghost"}
              size="sm"
              className={cn(
                "px-3 py-1.5 text-sm font-medium min-w-[36px]",
                page === '...' && "cursor-default hover:bg-transparent text-gray-400"
              )}
              onClick={() => page !== '...' && onPageChange(page)}
              disabled={page === '...'}
              title={page !== '...' ? `${page} sahifa` : ''}
            >
              {page}
            </Button>
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          disabled={pagination.page === pagination.pages}
          onClick={() => onPageChange(pagination.page + 1)}
          title="Keyingi sahifa"
          className="p-2"
        >
          <ChevronRight size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          disabled={pagination.page === pagination.pages}
          onClick={() => onPageChange(pagination.pages)}
          title="Oxirgi sahifa"
          className="p-2"
        >
          <ChevronsRight size={16} />
        </Button>
      </div>
    </div>
  );
} 