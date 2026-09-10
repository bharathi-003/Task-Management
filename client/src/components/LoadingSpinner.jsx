import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  const dimension = size === 'small' ? '18px' : size === 'large' ? '36px' : '26px';

  return (
    <div className="loading-container">
      <div
        className="spinner"
        style={{
          width: dimension,
          height: dimension,
          borderWidth: size === 'small' ? '2px' : '3px',
        }}
      />
      {message && (
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '-0.01em' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
