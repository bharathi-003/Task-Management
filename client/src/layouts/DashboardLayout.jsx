import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Dynamic header page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'Executive Overview';
    if (path.includes('/admin/employees')) return 'Employee Directory';
    if (path.includes('/admin/tasks')) return 'Organization Tasks';
    if (path.includes('/employee/dashboard')) return 'My Dashboard';
    if (path.includes('/employee/tasks')) return 'Assigned Deliverables';
    return 'TaskFlow';
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-wrapper">
        <Navbar
          pageTitle={getPageTitle()}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="content-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
