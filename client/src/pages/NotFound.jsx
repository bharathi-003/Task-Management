import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const NotFound = () => {
  const { isAuthenticated, role } = useAuth();
  const returnLink = !isAuthenticated
    ? '/login'
    : role === 'admin'
    ? '/admin/dashboard'
    : '/employee/dashboard';

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '32px 20px',
      }}
    >
      <div
        style={{
          width: '76px',
          height: '76px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#f1f5f9',
          border: '1px solid var(--border-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <FileQuestion size={38} strokeWidth={2.2} />
      </div>

      <div
        style={{
          fontSize: '0.82rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--primary)',
          marginBottom: '6px',
        }}
      >
        Error &bull; 404
      </div>

      <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '-0.03em' }}>
        Page Not Located
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', lineHeight: 1.6, marginBottom: '28px', fontSize: '0.96rem' }}>
        The destination you are seeking has been moved, renamed, or is currently unavailable in this workspace.
      </p>

      <Link to={returnLink} className="btn btn-primary" style={{ padding: '11px 22px' }}>
        <ArrowLeft size={16} />
        <span>Return to Workspace</span>
      </Link>
    </div>
  );
};

export default NotFound;
