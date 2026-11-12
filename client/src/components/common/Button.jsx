import React from 'react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'light'
  size = 'md',         // 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
  ...rest
}) {
  const btnClass = `btn btn-${variant} btn-${size} ${className}`.trim();

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={btnClass}
      {...rest}
    >
      {icon && iconPosition === 'left' && <span className="btn-icon left">{icon}</span>}
      <span className="btn-text">{children}</span>
      {icon && iconPosition === 'right' && <span className="btn-icon right">{icon}</span>}
    </button>
  );
}
