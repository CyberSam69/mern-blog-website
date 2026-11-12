import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import './SearchBar.css';

export default function SearchBar({
  placeholder = 'Search technology articles, topics...',
  onSearch,
  initialValue = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  autoFocus = false,
  liveSearch = false,
  className = '',
}) {
  const [query, setQuery] = useState(initialValue);
  const isInitialMount = useRef(true);
  const lastSearchedRef = useRef(initialValue);

  // Sync internal state if initialValue changes externally
  useEffect(() => {
    setQuery(initialValue);
    lastSearchedRef.current = initialValue;
  }, [initialValue]);

  // Debounced live search (skips initial mount and redundant queries)
  useEffect(() => {
    if (!liveSearch) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const trimmed = query.trim();
      if (trimmed !== lastSearchedRef.current) {
        lastSearchedRef.current = trimmed;
        if (onSearch) {
          onSearch(trimmed);
        }
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query, liveSearch, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    lastSearchedRef.current = trimmed;
    if (onSearch) {
      onSearch(trimmed);
    }
  };

  const handleClear = () => {
    setQuery('');
    lastSearchedRef.current = '';
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form className={`search-bar search-bar-${size} ${className}`} onSubmit={handleSubmit} role="search">
      <span className="search-icon" aria-hidden="true">
        <Icon name="search" size={size === 'lg' ? 20 : 16} color="var(--text-secondary)" />
      </span>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        autoFocus={autoFocus}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="search-clear-btn"
          aria-label="Clear search query"
        >
          <Icon name="x" size={14} color="var(--text-secondary)" />
        </button>
      )}
      <button type="submit" className="search-submit-btn">
        Search
      </button>
    </form>
  );
}

