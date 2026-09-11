import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import StatCard from '../../components/StatCard';
import { StatusBadge, PriorityBadge } from '../../components/TaskBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/formatDate';
import { TASK_STATUSES } from '../../utils/constants';
import {
  Clock,
  Hourglass,
  CheckCircle2,
  CheckSquare,
  ArrowRight,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Briefcase,
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchMyTasks = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.get('/tasks/my');
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error('Failed to load employee tasks:', err);
      setErrorMsg(err.message || 'Unable to load your assigned tasks.');
      error(err.message || 'Unable to load your assigned tasks.');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchMyTasks();
  }, [fetchMyTasks]);

  // Handle status update
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setUpdatingTaskId(taskId);
      const res = await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      if (res.data.success) {
        success(`Task status updated to "${newStatus}". Administrator notified.`, 'Status Updated');
        // Update task locally in state
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t))
        );
      }
    } catch (err) {
      error(err.message || 'Failed to update task status');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Calculate stats from actual assigned tasks
  const notStartedCount = tasks.filter((t) => t.status === 'Not Started').length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <Briefcase size={13} />
              <span>Personal Workspace</span>
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Welcome back, {user?.name || 'Team Member'}! 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '3px' }}>
            Here is your active workload overview and assigned deliverables.
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={fetchMyTasks}
          title="Refresh assigned deliverables"
          style={{ padding: '9px 16px', fontSize: '0.86rem' }}
        >
          <RefreshCw size={15} />
          <span>Refresh Tasks</span>
        </button>
      </div>

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
            marginBottom: '24px',
          }}
        >
          <AlertCircle size={20} />
          <span style={{ fontWeight: 600 }}>{errorMsg}</span>
          <button
            onClick={fetchMyTasks}
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

      {loading ? (
        <LoadingSpinner message="Retrieving your assigned tasks from database..." />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="stats-grid">
            <StatCard
              label="Not Started"
              value={notStartedCount}
              icon={Clock}
              variant="not-started"
              description="Awaiting initial work"
            />

            <StatCard
              label="In Progress / Pending"
              value={pendingCount}
              icon={Hourglass}
              variant="pending"
              description="Currently in progress"
            />

            <StatCard
              label="Completed"
              value={completedCount}
              icon={CheckCircle2}
              variant="completed"
              description="Finished & delivered"
            />
          </div>

          {/* Assigned Tasks Card */}
          <div className="card glass-card">
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
                  <h3 className="card-title">My Assigned Tasks ({tasks.length})</h3>
                  <div className="card-subtitle">Quickly review requirements and update deliverable progress</div>
                </div>
              </div>

              <Link
                to="/employee/tasks"
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.86rem' }}
              >
                <span>Detailed Cards View</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="table-responsive">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <CheckSquare className="empty-state-icon" />
                  <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>No tasks assigned yet</p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '360px' }}>
                    You currently have no active deliverables assigned. You will receive an email notification as soon as a new task is delegated to you.
                  </p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: '240px' }}>Task Title</th>
                      <th>Priority</th>
                      <th>Current Status</th>
                      <th>Update Status</th>
                      <th>Assigned Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task._id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{task.title}</div>
                          <div
                            style={{
                              fontSize: '0.82rem',
                              color: 'var(--text-secondary)',
                              marginTop: '3px',
                              maxWidth: '340px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {task.description}
                          </div>
                        </td>
                        <td>
                          <PriorityBadge priority={task.priority} />
                        </td>
                        <td>
                          <StatusBadge status={task.status} />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <select
                              className="status-select"
                              value={task.status}
                              disabled={updatingTaskId === task._id}
                              onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            >
                              {TASK_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                            {updatingTaskId === task._id && (
                              <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                            )}
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
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
    </div>
  );
};

export default EmployeeDashboard;
