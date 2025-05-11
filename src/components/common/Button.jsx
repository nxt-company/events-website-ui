import React from 'react';

function Button({ children, variant = 'default', onClick, type = 'button', className = '' }) {
  const baseClasses = 'btn';
  const variantClasses = {
    default: '',
    primary: 'btn-primary',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;