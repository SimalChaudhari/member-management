import React, { useMemo, useState } from 'react';
import IconifyIcon from '../base/IconifyIcon';

export interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T, index?: number) => React.ReactNode;
  width?: string;
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
        color="#FFFFFF"
        className="opacity-100"
      />
    );
  };

  return (
    <div
      className={`w-full max-w-full mx-auto rounded-2xl shadow-2xl overflow-hidden bg-white/80 backdrop-blur ${className}`}
    >
      {/* Custom Header with Title and Search/Filter */}
      {showHeader && (title || showSearch || showFilters) && (
        <div className="title-header text-white px-4 sm:px-6 py-4 rounded-t-2xl">
          <div
            className={`flex flex-col lg:flex-row lg:items-center gap-4 ${
              headerLayout === 'center'
                ? 'lg:justify-center'
                : headerLayout === 'right'
                ? 'lg:justify-end'
                : 'lg:justify-between'
            }`}
          >
            {/* Title */}
            {title && (
              <div className="flex-shrink-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow">{title}</h2>
              </div>
            )}

            {/* Search and Filters */}
            {(showSearch || showFilters) && (
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                {showSearch && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={searchPlaceholder}
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(0);
                      }}
                      className="rounded-lg pl-10 pr-4 py-2 text-sm border bg-white text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 w-full sm:w-64"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IconifyIcon icon="mdi:search" width={18} height={18} color="#6B7280" />
                    </div>
                  </div>
                )}

                {showFilters && filterOptions.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-white/90 font-medium">Filter by:</span>
                    {filterOptions.map((filter) => (
                      <select
                        key={String(filter.key)}
                        value={filters[filter.key as string] || ''}
                        onChange={(e) => {
                          setFilters((prev) => ({
                            ...prev,
                            [filter.key]: e.target.value,
                          }));
                          setPage(0);
                        }}
                        className="rounded-lg px-3 py-2 text-xs border title-header text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">All {filter.label}</option>
                        {filter.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
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

      {/* Table Body */}
      <div
        className={`overflow-y-auto overflow-x-auto ${showHeader ? '' : 'rounded-t-2xl'}`}
        style={{ maxHeight: '60vh' }}
      >
        <table className="min-w-full w-full text-sm">
          <thead>
            <tr className={`bg-red-table-header-color sticky top-0 z-10 ${headerClassName}`}>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-3 sm:px-5 py-3 sm:py-5 text-left font-semibold text-white text-xs sm:text-sm ${
                    column.sortable ? 'cursor-pointer transition-colors duration-200 group' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="truncate">{column.header}</span>
                    {column.sortable && <SortIcon field={column.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {paginatedRows.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-all duration-500 ease-in-out ${
                  idx % 2 === 0 ? 'bg-white/80' : 'bg-gray-100/60'
                } hover:bg-indigo-50 animate-fadeIn ${rowClassName} ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                style={{ animationDelay: `${idx * 60}ms` }}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm"
                  >
                    {column.render ? (
                      column.render(row[column.key], row, idx)
                    ) : (
                      <span className="truncate block">{row[column.key]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls - Inline layout for desktop */}
      <div className="bg-gray-50/50 py-3 px-2 sm:px-4">
        {/* Mobile layout - Stacked */}
        <div className="block sm:hidden">
          <div className="flex flex-col gap-3">
            {/* Rows per page selector */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
                Rows per page:
              </span>
              <select
                className="border border-gray-300 rounded-lg px-2 py-1 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(0);
                }}
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Results info */}
            <div className="text-center">
              <span className="text-xs text-gray-600 font-medium">
                Showing {page * pageSize + 1} to{' '}
                {Math.min((page + 1) * pageSize, filteredAndSortedRows.length)} of{' '}
                {filteredAndSortedRows.length} results
              </span>
            </div>

            {/* Page info */}
            <div className="text-center">
              <span className="text-xs text-gray-700 font-medium">
                Page {page + 1} of {totalPages}
              </span>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-center gap-2">
              <button
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                ← Prev
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      page === i
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md'
                    }`}
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Desktop layout - Inline */}
        <div className="hidden sm:flex sm:items-center sm:justify-between mt-10">
          {/* Left side - Rows per page and Showing info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                Rows per page:
              </span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(0);
                }}
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-sm text-gray-600 font-medium">
              Showing {page * pageSize + 1} to{' '}
              {Math.min((page + 1) * pageSize, filteredAndSortedRows.length)} of{' '}
              {filteredAndSortedRows.length} results
            </span>
          </div>

          {/* Right side - Page info and navigation */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700 font-medium">
              Page {page + 1} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                ← Prev
              </button>
              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      page === i
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md'
                    }`}
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s both;
          }
        `}
      </style>
    </div>
  );
};

export default DataTable;
