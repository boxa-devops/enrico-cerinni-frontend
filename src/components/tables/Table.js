/**
 * Table Component
 * 
 * A comprehensive data table component with sorting, pagination, selection, and custom rendering.
 * Supports responsive design, loading states, and empty states.
 * 
 * @component
 * @example
 * <Table
 *   columns={[
 *     { key: 'name', label: 'Name', sortable: true },
 *     { key: 'email', label: 'Email' },
 *     { key: 'actions', label: 'Actions', render: (value, row) => <Button>Edit</Button> }
 *   ]}
 *   data={users}
 *   onRowClick={handleRowClick}
 *   sortable
 *   pagination
 *   selectable
 * />
 */

'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, LoadingSpinner, Button } from '../ui';
import { cn } from '../../utils/cn';

const Table = ({ 
  columns, 
  data, 
  onRowClick, 
  className = '',
  emptyMessage = 'Ma\'lumot mavjud emas',
  loading = false,
  sortable = false,
  onSort,
  sortColumn,
  sortDirection,
  pagination = false,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  totalItems = 0,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  getRowClassName,
  highlightRows = false,
  ...props 
}) => {
  const [localSortColumn, setLocalSortColumn] = useState(sortColumn);
  const [localSortDirection, setLocalSortDirection] = useState(sortDirection);

  const handleSort = (columnKey) => {
    if (!sortable) return;
    
    const newDirection = localSortColumn === columnKey && localSortDirection === 'asc' ? 'desc' : 'asc';
    setLocalSortColumn(columnKey);
    setLocalSortDirection(newDirection);
    
    if (onSort) {
      onSort(columnKey, newDirection);
    }
  };

  const sortedData = useMemo(() => {
    if (!sortable || !localSortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[localSortColumn];
      const bValue = b[localSortColumn];
      
      if (aValue < bValue) return localSortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return localSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortable, localSortColumn, localSortDirection]);

  const handleRowSelect = (rowId) => {
    if (!selectable || !onSelectionChange) return;
    
    const newSelection = selectedRows.includes(rowId)
      ? selectedRows.filter(id => id !== rowId)
      : [...selectedRows, rowId];
    
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (!selectable || !onSelectionChange) return;
    
    const allIds = data.map(row => row.id);
    const newSelection = selectedRows.length === allIds.length ? [] : allIds;
    onSelectionChange(newSelection);
  };

  // Loading state
  if (loading) {
    return (
      <Card className="p-8">
        <LoadingSpinner message="Ma'lumotlar yuklanmoqda..." />
      </Card>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Ma'lumot topilmadi</h3>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </Card>
    );
  }

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <Card className={cn('overflow-hidden', className)} padding="none" {...props}>
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {/* Selection Header */}
              {selectable && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              
              {/* Column Headers */}
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    sortable && column.sortable !== false && 'cursor-pointer hover:bg-gray-100 transition-colors select-none',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.className
                  )}
                  style={{ width: column.width }}
                  onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                >
                  <div className={cn(
                    'flex items-center gap-1',
                    column.align === 'center' && 'justify-center',
                    column.align === 'right' && 'justify-end'
                  )}>
                    <span>{column.label}</span>
                    {sortable && column.sortable !== false && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={cn(
                            'h-3 w-3 transition-colors',
                            localSortColumn === column.key && localSortDirection === 'asc' 
                              ? 'text-blue-600' 
                              : 'text-gray-300'
                          )}
                        />
                        <ChevronDown 
                          className={cn(
                            'h-3 w-3 -mt-1 transition-colors',
                            localSortColumn === column.key && localSortDirection === 'desc' 
                              ? 'text-blue-600' 
                              : 'text-gray-300'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row, index) => {
              const isSelected = selectedRows.includes(row.id);
              const customRowClass = getRowClassName ? getRowClassName(row) : '';
              
              return (
                <tr 
                  key={row.id || index} 
                  className={cn(
                    'transition-colors duration-150',
                    onRowClick && 'cursor-pointer hover:bg-gray-50',
                    isSelected && 'bg-blue-50',
                    highlightRows && customRowClass,
                    customRowClass
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {/* Selection Cell */}
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleRowSelect(row.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                  )}
                  
                  {/* Data Cells */}
                  {columns.map((column) => (
                    <td 
                      key={column.key} 
                      className={cn(
                        'px-6 py-4 text-sm text-gray-900',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        column.wrap === false && 'whitespace-nowrap',
                        column.cellClassName
                      )}
                      style={{ width: column.width }}
                    >
                      {column.render ? column.render(row[column.key], row, index) : row[column.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              {Math.min((currentPage - 1) * pageSize + 1, totalItems)} - {Math.min(currentPage * pageSize, totalItems)} / {totalItems}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Oldingi
            </Button>
            
            <span className="text-sm text-gray-700 px-2">
              {currentPage} / {totalPages}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              Keyingi
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Table; 