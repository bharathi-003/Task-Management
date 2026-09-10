import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  const { page = 1, totalPages = 1, total = 0, limit = 10 } = pagination || {};

  if (totalPages <= 1 && total === 0) return null;

  // Generate list of page numbers to show
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const startRecord = total === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  return (
    <div className="pagination-wrapper">
      <div className="pagination-info">
        Showing <strong style={{ color: 'var(--text-primary)' }}>{startRecord}</strong> &ndash; <strong style={{ color: 'var(--text-primary)' }}>{endRecord}</strong> of{' '}
        <strong style={{ color: 'var(--text-primary)' }}>{total}</strong> tasks (Page {page} of {totalPages})
      </div>

      <div className="pagination-buttons">
        <button
          className="pagination-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous Page"
        >
          <ChevronLeft size={16} />
          <span>Prev</span>
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            className={`pagination-btn ${num === page ? 'active' : ''}`}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}

        <button
          className="pagination-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
