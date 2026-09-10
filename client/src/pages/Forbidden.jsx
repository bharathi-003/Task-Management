import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Forbidden = () => {
  const { role } = useAuth();
  const dashboardLink = role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';

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
          backgroundColor: '#fff1f2',
          border: '1px solid #fecdd3',
          color: '#e11d48',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <ShieldAlert size={38} strokeWidth={2.2} />
      </div>

      <div
        style={{
          fontSize: '0.82rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#e11d48',
          marginBottom: '6px',
        }}
      >
        Access Denied &bull; 403
      </div>

      <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '-0.03em' }}>
        Administrative Clearance Required
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', lineHeight: 1.6, marginBottom: '28px', fontSize: '0.96rem' }}>
        You do not possess the required authorization clearance to access this protected resource. Please return to your designated workspace.
      </p>

      <Link to={dashboardLink} className="btn btn-primary" style={{ padding: '11px 22px' }}>
        <ArrowLeft size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default Forbidden;
