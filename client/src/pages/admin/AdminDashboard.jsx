import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import StatCard from '../../components/StatCard';
import { StatusBadge, PriorityBadge } from '../../components/TaskBadge';
import TaskModal from '../../components/TaskModal';
import CreateAdminModal from '../../components/CreateAdminModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/formatDate';
import {
  Clock,
  Hourglass,
  CheckCircle2,
  Plus,
  ArrowRight,
  CheckSquare,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    notStarted: 0,
    pending: 0,
    inProgress: 0,
    pendingOrInProgress: 0,
    completed: 0,
    total: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);

  const { error } = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Fetch both stats and latest tasks concurrently
      const [statsRes, tasksRes] = await Promise.all([
        api.get('/tasks/stats'),
        api.get('/tasks?page=1&limit=5'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      if (tasksRes.data.success) {
        setRecentTasks(tasksRes.data.tasks);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setErrorMsg(err.message || 'Unable to load dashboard statistics.');
      error(err.message || 'Unable to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Calculate completion percentage
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div>
      {/* Top Banner with Action Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <Calendar size={13} />
              <span>{todayDateFormatted}</span>
            </div>
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Executive Overview
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '4px' }}>
            Track cross-functional task completion, allocate deliverables, and monitor team productivity.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setIsCreateAdminOpen(true)}
            id="btn-create-admin-dash"
            style={{ padding: '12px 20px', fontSize: '0.92rem' }}
          >
            <UserPlus size={17} strokeWidth={2.4} />
            <span>New Admin Account</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            id="btn-assign-task"
            style={{ padding: '12px 24px', fontSize: '0.94rem' }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Assign New Task</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 'var(--radius-md)',
            color: '#be123c',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '28px',
          }}
        >
          <AlertCircle size={20} />
          <span style={{ fontWeight: 600 }}>{errorMsg}</span>
          <button
            onClick={fetchDashboardData}
            style={{
              marginLeft: 'auto',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              color: '#be123c',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <LoadingSpinner message="Calculating workspace statistics and recent activity..." />
      ) : (
        <>
          {/* Primary Task Statistics Cards */}
          <div className="stats-grid">
            {/* 1. Not Started */}
            <StatCard
              label="Not Started"
              value={stats.notStarted}
              icon={Clock}
              variant="not-started"
              description="Awaiting initial pickup"
            />

            {/* 2. Pending / In Progress */}
            <StatCard
              label="In Progress / Pending"
              value={stats.pendingOrInProgress}
              icon={Hourglass}
              variant="pending"
              description="Actively being executed"
            />

            {/* 3. Completed */}
            <StatCard
              label="Completed"
              value={stats.completed}
              icon={CheckCircle2}
              variant="completed"
              description="Verified & finished deliverables"
            />
          </div>

          {/* Velocity & Completion Progress Banner */}
          <div
            className="card"
            style={{
              padding: '24px 28px',
              marginBottom: '32px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUp size={22} strokeWidth={2.4} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Total Project Completion Velocity
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{stats.completed}</strong> of{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>{stats.total}</strong> organizational deliverables marked completed
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em' }}>
                  {completionRate}%
                </span>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  rate
                </span>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div
              style={{
                width: '100%',
                height: '10px',
                background: '#e2e8f0',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${completionRate}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #4f46e5 0%, #10b981 100%)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          </div>

          {/* Recent Tasks Card */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckSquare size={18} />
                </div>
                <div>
                  <h3 className="card-title">Recently Assigned Tasks</h3>
                  <div className="card-subtitle">Latest 5 deliverables delegated across team members</div>
                </div>
              </div>

              <Link
                to="/admin/tasks"
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.86rem' }}
              >
                <span>View All Tasks</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="table-responsive">
              {recentTasks.length === 0 ? (
                <div className="empty-state">
                  <CheckSquare className="empty-state-icon" />
                  <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>No tasks assigned yet</p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '360px' }}>
                    Click "+ Assign New Task" to delegate your first deliverable to a team member.
                  </p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: '240px' }}>Task Title</th>
                      <th>Assigned Team Member</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Assigned Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTasks.map((task) => (
                      <tr key={task._id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{task.title}</div>
                          <div
                            style={{
                              fontSize: '0.82rem',
                              color: 'var(--text-secondary)',
                              maxWidth: '340px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              marginTop: '2px',
                            }}
                          >
                            {task.description}
                          </div>
                        </td>
                        <td>
                          <div className="table-user-cell">
                            <div className="table-user-avatar">
                              {task.assignedTo?.name ? task.assignedTo.name[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                                {task.assignedTo?.name || 'Unassigned'}
                              </div>
                              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                                {task.assignedTo?.email || '—'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <PriorityBadge priority={task.priority} />
                        </td>
                        <td>
                          <StatusBadge status={task.status} />
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {formatDate(task.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDashboardData}
      />

      {/* Admin Creation Modal */}
      <CreateAdminModal
        isOpen={isCreateAdminOpen}
        onClose={() => setIsCreateAdminOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};

export default AdminDashboard;
