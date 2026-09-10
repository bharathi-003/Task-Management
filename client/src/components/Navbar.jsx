import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, LogOut, ChevronRight, Activity } from 'lucide-react';

const Navbar = ({ pageTitle = 'Dashboard', onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const isHome = location.pathname.endsWith('/dashboard');

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="mobile-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <div className="breadcrumb-nav">
            <span className="breadcrumb-item">Workspace</span>
            <ChevronRight size={13} />
            <span className="breadcrumb-active">{pageTitle}</span>
          </div>
          <h1 className="page-heading">{pageTitle}</h1>
        </div>
      </div>

      <div className="navbar-right">
        {/* System Health Status Pill */}
        <div className="status-pill-online" title="Backend API & MongoDB cluster connected">
          <span className="status-pill-dot" />
          <span>Operational</span>
        </div>

        {/* User Pill */}
        <div className="navbar-user-chip">
          <div className="navbar-user-avatar">{initials}</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {user?.name || 'User'}
            </span>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 700 }}>
              {user?.role === 'admin' ? 'Administrator' : 'Employee'}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="btn btn-secondary"
          style={{ padding: '7px 14px', fontSize: '0.84rem' }}
          title="Sign out of TaskFlow"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
