import React from 'react';

const Button = ({ children, primary = true, disabled = false, onClick, className = '', ...props }) => {
  const buttonStyle = {
    backgroundColor: primary ? '#4CAF50' : '#2196F3',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    ...props.style
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
