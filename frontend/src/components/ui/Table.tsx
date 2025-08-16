import React, { useState, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export type Column<T> = {
  header?: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  label?: string;
  sortable?: boolean;
  className?: string;
  render?: (item: T) => React.ReactNode;
};

export type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (item: T) => void;
  isSelectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
};

// Individual table components for compatibility with existing code
export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table ref={ref} className={`min-w-full divide-y divide-gray-200 ${className || ''}`} {...props} />
));
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={`bg-gray-50 ${className || ''}`} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={`bg-white divide-y divide-gray-200 ${className || ''}`} {...props} />
));
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={`hover:bg-gray-50 ${className || ''}`} {...props} />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className || ''}`}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={`px-6 py-4 whitespace-nowrap ${className || ''}`} {...props} />
));
TableCell.displayName = "TableCell";

// Advanced Table component with sorting, pagination, etc.
export function AdvancedTable<T>({
  columns,
  data,
  keyField,
  onRowClick,
  isSelectable = false,
  onSelectionChange,
  pagination,
  isLoading = false,
  emptyMessage = "No data available",
  className = "",
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // Handle sorting
  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }

    setSortConfig({ key, direction });
  };

  // Handle row selection
  const handleRowSelect = (item: T) => {
    let updatedSelection;

    if (selectedRows.some(row => row[keyField] === item[keyField])) {
      updatedSelection = selectedRows.filter(row => row[keyField] !== item[keyField]);
    } else {
      updatedSelection = [...selectedRows, item];
    }

    setSelectedRows(updatedSelection);

    if (onSelectionChange) {
      onSelectionChange(updatedSelection);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
      if (onSelectionChange) onSelectionChange([]);
    } else {
      setSelectedRows([...data]);
      if (onSelectionChange) onSelectionChange([...data]);
    }
  };

  // Apply sorting to data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      if (sortConfig.direction === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
  }, [data, sortConfig]);

  // Reset selection when data changes
  useEffect(() => {
    setSelectedRows([]);
  }, [data]);

  // Render cell content
  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }

    return item[column.accessor] as React.ReactNode;
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      {isLoading ? (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {isSelectable && (
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedRows.length === data.length && data.length > 0}
                      onChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className={`${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''} ${column.className || ''}`}
                    onClick={() => column.sortable && handleSort(column.accessor as keyof T)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.header ?? column.label ?? String(column.accessor)}</span>
                      {column.sortable && (
                        <span className="inline-flex flex-col">
                          <ChevronUpIcon
                            className={`h-3 w-3 ${sortConfig?.key === column.accessor && sortConfig.direction === 'asc'
                                ? 'text-blue-600'
                                : 'text-gray-400'
                              }`}
                          />
                          <ChevronDownIcon
                            className={`h-3 w-3 ${sortConfig?.key === column.accessor && sortConfig.direction === 'desc'
                                ? 'text-blue-600'
                                : 'text-gray-400'
                              }`}
                          />
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length > 0 ? (
                sortedData.map((item) => (
                  <TableRow
                    key={item[keyField] as React.Key}
                    className={`${onRowClick ? 'cursor-pointer' : ''} ${selectedRows.some(row => row[keyField] === item[keyField]) ? 'bg-blue-50' : ''}`}
                    onClick={() => onRowClick && onRowClick(item)}
                  >
                    {isSelectable && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedRows.some(row => row[keyField] === item[keyField])}
                          onChange={() => handleRowSelect(item)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className={column.className || ''}>
                        {renderCell(item, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={isSelectable ? columns.length + 1 : columns.length}
                    className="text-center text-sm text-gray-500"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {pagination && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                    <span className="font-medium">{pagination.totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
                      disabled={pagination.currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${pagination.currentPage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${pagination.currentPage === pagination.totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Export AdvancedTable as default for backward compatibility
export default AdvancedTable;
