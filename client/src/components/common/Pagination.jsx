import React from 'react';
import Icon from './Icon';
import './Pagination.css';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    // Show first, last, current, and +/- 1 around current
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (
      (i === currentPage - 2 && i > 1) ||
      (i === currentPage + 2 && i < totalPages)
    ) {
      pages.push('...');
    }
  }

  // Deduplicate consecutive ellipses
  const dedupedPages = pages.filter((page, index) => {
    if (page === '...' && pages[index - 1] === '...') return false;
    return true;
  });

  return (
    <nav className={`pagination ${className}`} aria-label="Blog pagination">
      <button
        type="button"
        className="pagination-btn pagination-prev"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <Icon name="chevron-left" size={16} />
        <span>Previous</span>
      </button>

      <ul className="pagination-list">
        {dedupedPages.map((page, index) => (
          <li key={`page-${index}`}>
            {page === '...' ? (
              <span className="pagination-ellipsis">…</span>
            ) : (
              <button
                type="button"
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="pagination-btn pagination-next"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <span>Next</span>
        <Icon name="chevron-right" size={16} />
      </button>
    </nav>
  );
}

