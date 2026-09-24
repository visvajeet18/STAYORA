const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1 && totalItems <= 10) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination-wrapper">
      <div className="pagination">
        <button 
          className="pagination-btn nav-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &lsaquo; Previous
        </button>
        
        <div className="pagination-numbers">
          {pages.map(page => (
            <button 
              key={page}
              className={`pagination-btn page-num ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button 
          className="pagination-btn nav-btn"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next &rsaquo;
        </button>
      </div>

      {onItemsPerPageChange && (
        <div className="items-per-page-selector">
          <label htmlFor="itemsPerPage">Show:</label>
          <select 
            id="itemsPerPage" 
            value={itemsPerPage} 
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="items-select"
          >
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;
