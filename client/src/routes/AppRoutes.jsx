import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts & Guards
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Login from '../pages/Login';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminEmployees from '../pages/admin/AdminEmployees';
import AdminTasks from '../pages/admin/AdminTasks';
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import EmployeeTasks from '../pages/employee/EmployeeTasks';
import Forbidden from '../pages/Forbidden';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  const { isAuthenticated, role } = useAuth();

  // Root redirect helper
  const RootRedirect = () => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return role === 'admin' ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/employee/dashboard" replace />
    );
  };

  // Login redirect helper (if already authenticated)
  const LoginRedirect = () => {
    if (isAuthenticated) {
      return role === 'admin' ? (
        <Navigate to="/admin/dashboard" replace />
      ) : (
        <Navigate to="/employee/dashboard" replace />
      );
    }
    return <Login />;
  };

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginRedirect />} />
      <Route path="/" element={<RootRedirect />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="tasks" element={<AdminTasks />} />
      </Route>

      {/* Employee Protected Routes */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="tasks" element={<EmployeeTasks />} />
      </Route>

      {/* Error Routes */}
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
