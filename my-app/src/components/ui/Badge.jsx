import React from 'react';

function Badge({ variant = 'neutral', children, className = '' }) {
  const variantClass = `badge-${variant}`;
  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
