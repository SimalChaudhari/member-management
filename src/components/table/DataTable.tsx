import React, { useMemo, useState } from 'react';
import IconifyIcon from '../base/IconifyIcon';

export interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T, index?: number) => React.ReactNode;
  width?: string;
  /** When true, allows text to wrap to next line instead of truncating */
  wrap?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  onRowClick?: (row: T) => void;
  showSearch?: boolean;
  showFilters?: boolean;
  filterOptions?: {
    key: keyof T;
    label: string;
    options: { value: string; label: string }[];
  }[];
  title?: string;
  showHeader?: boolean;
  headerLayout?: 'left' | 'center' | 'right';
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  pageSizeOptions = [5, 10, 25, 50, 100],
  defaultPageSize = 10,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No records found.',
  className = '',
  headerClassName = '',
  rowClassName = '',
  onRowClick,
  showSearch = true,
  showFilters = false,
  filterOptions = [],
  title,
  showHeader = true,
  headerLayout = 'left',
}: DataTableProps<T>) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortField, setSortField] = useState<keyof T | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Sort function
  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtered and sorted data
  const filteredAndSortedRows = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (search) {
      filtered = data.filter((row) =>
        Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Apply column filters
    if (showFilters && filterOptions.length > 0) {
      filtered = filtered.filter((row) => {
        return filterOptions.every((filter) => {
          const filterValue = filters[filter.key as string];
          if (!filterValue) return true;
          return String(row[filter.key]).toLowerCase() === filterValue.toLowerCase();
        });
      });
    }

    // Apply sorting
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Handle date sorting
        if ((aValue as any) instanceof Date && (bValue as any) instanceof Date) {
          aValue = (aValue as Date).getTime() as any;
          bValue = (bValue as Date).getTime() as any;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          // Check if it's a date string
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);
          if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
            aValue = aDate.getTime() as any;
            bValue = bDate.getTime() as any;
          } else {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
        }

        // Handle number sorting
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          // Keep as is
        } else if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
          aValue = Number(aValue) as any;
          bValue = Number(bValue) as any;
        }

        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [data, search, sortField, sortDirection, filters, showFilters, filterOptions]);

  // Paginated data
  const paginatedRows = useMemo(() => {
    const start = page * pageSize;
    return filteredAndSortedRows.slice(start, start + pageSize);
  }, [filteredAndSortedRows, page, pageSize]);

  // Pagination controls
  const totalPages = Math.ceil(filteredAndSortedRows.length / pageSize);

  // Sort icon component
  const SortIcon = ({ field }: { field: keyof T }) => {
    if (sortField !== field) {
      return (
        <IconifyIcon
          icon="mdi:unfold-more-horizontal"
          width={16}
          height={16}
          color="#9CA3AF"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      );
    }

    return (
      <IconifyIcon
        icon={sortDirection === 'asc' ? 'mdi:chevron-up' : 'mdi:chevron-down'}
        width={16}
        height={16}
        color="#374151"
        className="opacity-100"
      />
    );
  };

  return (
    <div
      className={`w-full max-w-full rounded-none sm:rounded-lg shadow overflow-hidden bg-white border-0 sm:border border-gray-200 ${className}`}
    >
      {/* Single unified card: Header + Table + Pagination + Strip */}
      {showHeader && (title || showSearch || showFilters) && (
        <div className="px-2 py-2 sm:px-4 sm:py-3 border-b border-gray-200 bg-gray-50/50">
          <div
            className={`flex flex-col gap-3 ${
              headerLayout === 'center'
                ? 'items-center'
                : headerLayout === 'right'
                ? 'items-end'
                : ''
            }`}
          >
            {title && (
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">{title}</h2>
            )}
            {(showSearch || showFilters) && (
              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-full">
                {showSearch && (
                  <div className="relative flex-1 min-w-0">
                    <input
                      type="text"
                      placeholder={searchPlaceholder}
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(0);
                      }}
                      className="w-full rounded pl-8 pr-2 py-1.5 sm:py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <IconifyIcon icon="mdi:search" width={16} height={16} color="#6B7280" />
                    </div>
                  </div>
                )}
                {showFilters && filterOptions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.map((filter) => (
                      <select
                        key={String(filter.key)}
                        value={filters[filter.key as string] || ''}
                        onChange={(e) => {
                          setFilters((prev) => ({ ...prev, [filter.key]: e.target.value }));
                          setPage(0);
                        }}
                        className="rounded px-2 py-1.5 sm:px-3 sm:py-2 text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 flex-1 sm:flex-initial"
                      >
                        <option value="">All {filter.label}</option>
                        {filter.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table - scrollable on mobile */}
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 'min(60vh, 400px)' }}>
        <table className="min-w-full w-full text-sm">
          <thead>
            <tr className={`bg-gray-50 sticky top-0 z-10 border-b border-gray-200 ${headerClassName}`}>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-700 text-xs sm:text-sm ${
                    column.sortable ? 'cursor-pointer transition-colors duration-200 group hover:bg-gray-200' : ''
                  } ${column.wrap ? 'whitespace-normal break-words align-top' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={`flex items-center gap-1 sm:gap-2 ${column.wrap ? 'flex-wrap' : ''}`}>
                    <span className={column.wrap ? 'break-words whitespace-normal' : 'truncate'}>{column.header}</span>
                    {column.sortable && <SortIcon field={column.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 sm:py-8 text-gray-400 text-xs sm:text-sm">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {paginatedRows.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                } hover:bg-blue-50/50 ${rowClassName} ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-1 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm ${column.wrap ? 'align-top' : ''}`}
                  >
                    {column.render ? (
                      column.render(row[column.key], row, idx)
                    ) : (
                      <span className={column.wrap ? 'block break-words whitespace-normal' : 'truncate block'}>{row[column.key]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - single responsive layout */}
      <div className="px-3 sm:px-4 py-3 border-t border-gray-200 bg-gray-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Rows:</span>
              <select
                className="rounded-md px-2 py-1.5 text-xs sm:text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(0);
                }}
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <span className="text-xs text-gray-600">
              {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filteredAndSortedRows.length)} of {filteredAndSortedRows.length}
            </span>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className="text-xs sm:text-sm text-gray-600 sm:mr-2">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                className="px-1.5 py-1 sm:px-3 sm:py-1.5 rounded text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Prev
              </button>
              <div className="flex gap-0.5 sm:gap-1 overflow-x-auto">
                {(() => {
                  const maxVisible = 5;
                  let start = Math.max(0, page - Math.floor(maxVisible / 2));
                  let end = Math.min(totalPages, start + maxVisible);
                  if (end - start < maxVisible) start = Math.max(0, end - maxVisible);
                  return Array.from({ length: end - start }, (_, i) => start + i).map((i) => (
                    <button
                      key={i}
                      className={`min-w-[24px] sm:min-w-[36px] px-1 py-1 sm:px-2 sm:py-1.5 rounded text-xs font-medium shrink-0 ${
                        page === i ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() => setPage(i)}
                    >
                      {i + 1}
                    </button>
                  ));
                })()}
              </div>
              <button
                className="px-1.5 py-1 sm:px-3 sm:py-1.5 rounded text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom blue strip - same as DynamicDataGrid */}
      <div
        style={{
          height: 4,
          width: '100%',
          backgroundColor: '#265EAC',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
        aria-hidden
      />
    </div>
  );
};

export default DataTable;
