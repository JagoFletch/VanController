import React from 'react';

const Button = ({ children, primary = true, disabled = false, onClick, className = '', ...props }) => {
  const buttonStyle = {
    backgroundColor: primary ? 'var(--primary-color)' : 'var(--secondary-color)',
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <button
      style={buttonStyle}
      disabled={disabled}
      onClick={onClick}
      className={`button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;