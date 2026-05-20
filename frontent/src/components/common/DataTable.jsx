import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const DataTable = ({ columns, data, loading, pagination, onPageChange, emptyMessage = 'No data found', onRowClick }) => {
  if (loading) {
    return (
      <div className="table-container">
        <div className="animate-pulse">
          <div className="flex gap-4 p-4 bg-dark-800/40">
            {columns.map((_, i) => (
              <div key={i} className="h-4 bg-dark-700 rounded flex-1" />
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-t border-dark-700/50">
              {columns.map((_, j) => (
                <div key={j} className="h-4 bg-dark-700/50 rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-container p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-800 flex items-center justify-center">
          <span className="text-3xl">📋</span>
        </div>
        <p className="text-dark-400 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="table-header">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row._id || i}
                onClick={() => onRowClick && onRowClick(row)}
                className={`hover:bg-dark-800/40 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, j) => (
                  <td key={j} className="table-cell">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-dark-700/50">
          <p className="text-sm text-dark-400">
            Showing <span className="font-medium text-dark-200">{((pagination.page - 1) * pagination.limit) + 1}</span>
            {' '}to{' '}
            <span className="font-medium text-dark-200">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>
            {' '}of{' '}
            <span className="font-medium text-dark-200">{pagination.total}</span> results
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <HiOutlineChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    pagination.page === pageNum
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'text-dark-400 hover:bg-dark-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
