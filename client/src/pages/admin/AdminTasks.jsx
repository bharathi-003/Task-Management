import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import { StatusBadge, PriorityBadge } from '../../components/TaskBadge';
import TaskModal from '../../components/TaskModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/formatDate';
import { Plus, CheckSquare, AlertCircle, RefreshCw, Layers } from 'lucide-react';

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { error } = useToast();

  const fetchTasks = useCallback(
    async (pageToLoad = 1, searchQuery = search) => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const params = new URLSearchParams({
          page: pageToLoad,
          limit: 10,
        });

        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }

        const res = await api.get(`/tasks?${params.toString()}`);
        if (res.data.success) {
          setTasks(res.data.tasks);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setErrorMsg(err.message || 'Unable to load tasks.');
        error(err.message || 'Unable to load tasks.');
      } finally {
        setLoading(false);
      }
    },
    [search, error]
  );

  useEffect(() => {
    // Debounce search input
    const timer = setTimeout(() => {
      fetchTasks(1, search);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage) => {
    fetchTasks(newPage, search);
  };

  return (
    <div>
      {/* Header and Action */}
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
              <Layers size={13} />
              <span>{pagination.total} Total Deliverables</span>
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Organization Tasks
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '3px' }}>
            Browse, search, and manage deliverables across all organization projects and employees.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
          id="btn-open-task-modal"
          style={{ padding: '12px 24px', fontSize: '0.94rem' }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Assign New Task</span>
        </button>
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
            marginBottom: '24px',
          }}
        >
          <AlertCircle size={20} />
          <span style={{ fontWeight: 600 }}>{errorMsg}</span>
          <button
            onClick={() => fetchTasks(pagination.page, search)}
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

      {/* Task Table Card */}
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
              <h3 className="card-title">Task Directory</h3>
              <div className="card-subtitle">Manage deliverable requirements, assignment status, and schedules</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Live Search Bar */}
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by title or employee name..."
            />

            <button
              className="btn btn-secondary"
              onClick={() => fetchTasks(pagination.page, search)}
              title="Refresh task directory"
              style={{ padding: '9px 13px' }}
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        <div className="table-responsive">
          {loading ? (
            <LoadingSpinner message="Searching and loading task deliverables..." />
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <CheckSquare className="empty-state-icon" />
              <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                {search.trim() ? 'No tasks match your search query' : 'No tasks created yet'}
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {search.trim()
                  ? 'Try searching with a different keyword or employee name.'
                  : 'Get started by clicking the "+ Assign New Task" button above.'}
              </p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ minWidth: '240px' }}>Task Title</th>
                  <th>Assigned Employee</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {task.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-secondary)',
                          marginTop: '3px',
                          maxWidth: '360px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={task.description}
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
                    <td style={{ color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {formatDate(task.createdAt)}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {formatDate(task.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Backend Pagination */}
        {!loading && tasks.length > 0 && (
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Assign Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchTasks(1, search)}
      />
    </div>
  );
};

export default AdminTasks;
