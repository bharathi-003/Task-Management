import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  LogOut,
  Layers,
  X,
  Sparkles,
  Shield,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = role === 'admin';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="mobile-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header with Brand Logo */}
        <div className="sidebar-header">
          <div className="brand-logo">
            <div className="brand-icon">
              <Layers size={22} strokeWidth={2.5} />
            </div>
            <div className="brand-text-block">
              <span className="brand-title">TaskFlow</span>
              <span className="brand-subtitle">Workspace Pro</span>
            </div>
          </div>

          <button
            className="mobile-toggle"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{ display: isOpen ? 'flex' : 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Navigation</div>

          {isAdmin ? (
            <>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <div className="nav-icon">
                  <LayoutDashboard size={19} />
                </div>
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/admin/employees"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <div className="nav-icon">
                  <Users size={19} />
                </div>
                <span>Employees</span>
              </NavLink>

              <NavLink
                to="/admin/tasks"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <div className="nav-icon">
                  <CheckSquare size={19} />
                </div>
                <span>All Tasks</span>
              </NavLink>

              <NavLink
                to="/admin/admins"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <div className="nav-icon">
                  <ShieldCheck size={19} />
                </div>
                <span>Administrators</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/employee/dashboard"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <div className="nav-icon">
                  <LayoutDashboard size={19} />
                </div>
                <span>My Dashboard</span>
              </NavLink>

              <NavLink
                to="/employee/tasks"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <div className="nav-icon">
                  <CheckSquare size={19} />
                </div>
                <span>Assigned Tasks</span>
              </NavLink>
            </>
          )}

          <div className="sidebar-section-title" style={{ marginTop: '12px' }}>
            Account Role
          </div>

          <div
            style={{
              padding: '12px 14px',
              margin: '0 4px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {isAdmin ? (
              <Shield size={16} color="var(--primary)" />
            ) : (
              <Briefcase size={16} color="#059669" />
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                {role || 'User'} Privileges
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {isAdmin ? 'Full administrative access' : 'Personal task management'}
              </span>
            </div>
          </div>
        </nav>

        {/* Footer with User Details & Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-details">
              <div className="user-name" title={user?.name}>
                {user?.name || 'User'}
              </div>
              <div className="user-role-tag">
                {user?.role === 'admin' ? 'Administrator' : 'Team Member'}
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="btn-sidebar-logout" title="Sign out">
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
