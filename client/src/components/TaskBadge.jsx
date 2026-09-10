import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStatusClass = (val) => {
    switch (val) {
      case 'Not Started':
        return 'badge-status-not-started';
      case 'Pending':
        return 'badge-status-pending';
      case 'In Progress':
        return 'badge-status-in-progress';
      case 'Completed':
        return 'badge-status-completed';
      default:
        return 'badge-status-not-started';
    }
  };

  return (
    <span className={`badge ${getStatusClass(status)}`}>
      <span className="badge-dot" />
      <span>{status || 'Not Started'}</span>
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const getPriorityClass = (val) => {
    switch (val) {
      case 'High':
        return 'badge-priority-high';
      case 'Medium':
        return 'badge-priority-medium';
      case 'Low':
        return 'badge-priority-low';
      default:
        return 'badge-priority-medium';
    }
  };

  return (
    <span className={`badge ${getPriorityClass(priority)}`}>
      <span>{priority || 'Medium'}</span>
    </span>
  );
};
