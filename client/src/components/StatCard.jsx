import React from 'react';

const StatCard = ({ label, value, icon: Icon, variant = 'total', description }) => {
  const getDefaultDescription = (v) => {
    switch (v) {
      case 'not-started':
        return 'Tasks pending initial review';
      case 'pending':
        return 'Tasks actively in progress';
      case 'completed':
        return 'Successfully finished deliverables';
      default:
        return 'Total workspace deliverables';
    }
  };

  return (
    <div className={`stat-card glass-card stat-${variant}`}>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value ?? 0}</span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
          {description || getDefaultDescription(variant)}
        </span>
      </div>
      {Icon && (
        <div className="stat-icon-wrapper">
          <Icon size={24} strokeWidth={2.2} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
