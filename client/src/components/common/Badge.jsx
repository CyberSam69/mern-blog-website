import React from 'react';
import './Badge.css';

export default function Badge({
  children,
  variant = 'blue', // 'blue' | 'green' | 'gray' | 'outline'
  size = 'md',      // 'sm' | 'md'
  className = '',
  onClick,
}) {
  const badgeClass = `badge badge-${variant} badge-${size} ${onClick ? 'clickable' : ''} ${className}`.trim();

  return (
    <span className={badgeClass} onClick={onClick}>
      {children}
    </span>
  );
}
