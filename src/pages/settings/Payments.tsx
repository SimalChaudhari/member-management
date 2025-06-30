import React, { useMemo, useState } from 'react';
import { PaymentRow, paymentRows } from '../../data/payments';

const statusColor = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Failed: 'bg-red-100 text-red-700',
  Cancelled: 'bg-gray-200 text-gray-700',
};

const typeColor = {
  Payment: 'bg-blue-100 text-blue-700',
  Refund: 'bg-red-100 text-red-700',
  Credit: 'bg-yellow-100 text-yellow-700',
};

const PAGE_SIZE_OPTIONS = [25, 50, 100];

const Payments: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  // Filtered data
  const filteredRows = useMemo(() => {
    if (!search) return paymentRows;
    return paymentRows.filter((row) =>
      Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  // Paginated data
  const paginatedRows = useMemo(() => {
    const start = page * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  // Pagination controls
  const totalPages = Math.ceil(filteredRows.length / pageSize);

  return (
    <div
      className="w-full max-w-full mx-auto mt-6 rounded-2xl shadow-2xl overflow-hidden bg-white/80 backdrop-blur"
      style={{ height: 800, display: 'flex', flexDirection: 'column' }}
    >
      {/* Gradient Header */}
      <div className="bg-[#0E416F] text-white px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <h2 className="text-base sm:text-lg font-semibold text-white drop-shadow">
          Payment Transactions
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full lg:w-auto">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <input
              type="text"
              placeholder="Search payments..."
              className="rounded-lg px-4 py-2 text-sm border bg-white text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 w-full sm:w-64"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
            <div className="flex items-center gap-2 ">
              <span className="text-xs text-white/90 font-medium">Filter by:</span>
              <select className="rounded-lg px-3 py-2 text-xs border bg-[#0E416F] text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200">
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Table Body: flex-1, scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        <table className="min-w-full w-full text-sm">
          <thead>
            <tr className="bg-black sticky top-0 z-10 ">
              <th className="px-5 py-5 text-left font-semibold text-white">SNo</th>
              <th className="px-5 py-5 text-left font-semibold text-white">Invoice/Receipt</th>
              <th className="px-5 py-5 text-left font-semibold text-white">Related Invoice</th>
              <th className="px-5 py-5 text-left font-semibold text-white">Date</th>
              <th className="px-5 py-5 text-left font-semibold text-white">Transaction Type</th>
              <th className="px-5 py-5 text-left font-semibold text-white">Amount</th>
              <th className="px-5 py-5 text-left font-semibold text-white">Document Type</th>
              <th className="px-5 py-5 text-left font-semibold text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400">
                  No payment records found.
                </td>
              </tr>
            )}
            {paginatedRows.map((row, idx) => (
              <tr
                key={row.id}
                className={`transition-all duration-500 ease-in-out ${
                  idx % 2 === 0 ? 'bg-white/80' : 'bg-gray-100/60'
                } hover:bg-indigo-50 animate-fadeIn`}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <td className="px-4 py-4 font-medium">{page * pageSize + idx + 1}</td>
                <td className="px-4 py-4 font-medium">{row.invoiceReceipt}</td>
                <td className="px-4 py-4">{row.relatedInvoice}</td>
                <td className="px-4 py-4">
                  {row.date
                    ? new Date(row.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : ''}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold shadow ${
                      typeColor[row.transactionType] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {row.transactionType}
                  </span>
                </td>
                <td className="px-4 py-4 font-semibold">${row.amount.toLocaleString()}</td>
                <td className="px-4 py-4">{row.documentType}</td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold shadow ${
                      statusColor[row.status] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls: always at bottom */}
      <div className="flex flex-col lg:flex-row lg:justify-between items-center mt-4 gap-4 px-4 pb-4 bg-gray-50/50 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700 font-medium">Rows per page:</span>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600 font-medium">
            Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, filteredRows.length)}{' '}
            of {filteredRows.length} results
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700 font-medium">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              ← Prev
            </button>

            {/* Page Numbers */}
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

            {/* Next Button */}
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

export default Payments;
