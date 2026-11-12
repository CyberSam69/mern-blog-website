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

  // Sync internal state if initialValue changes externally
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Debounced live search (skips initial mount)
  useEffect(() => {
    if (!liveSearch) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(query.trim());
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query, liveSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
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

