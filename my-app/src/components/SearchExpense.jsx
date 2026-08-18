import React from 'react';
import { Search, X } from 'lucide-react';

function SearchExpenses({ searchText, onSearchChange, placeholder = 'Search expenses by name or category...' }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
      <Search
        size={16}
        style={{
          position: 'absolute',
          left: '0.85rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        className="form-input"
        style={{
          paddingLeft: '2.4rem',
          paddingRight: searchText ? '2.2rem' : '0.85rem',
          borderRadius: 'var(--radius-full)',
        }}
        placeholder={placeholder}
        value={searchText}
        onChange={(event) => {
          if (onSearchChange) {
            onSearchChange(event.target.value);
          }
        }}
      />
      {searchText && (
        <button
          type="button"
          onClick={() => onSearchChange && onSearchChange('')}
          style={{
            position: 'absolute',
            right: '0.65rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            padding: '0.2rem',
            borderRadius: '50%',
          }}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export default SearchExpenses;
