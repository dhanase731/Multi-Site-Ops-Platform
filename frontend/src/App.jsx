import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import About from './pages/About/About';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/Admin/Dashboard';
import SiteList from './pages/Admin/Sites/List';
import CreateSite from './pages/Admin/Sites/Create';
import TaskBoard from './pages/ProjectManager/Tasks/Board';
import InventoryList from './pages/Store/Inventory/List';
import MaterialRequest from './pages/Store/Inventory/Request';
import TransactionHistory from './pages/Store/Inventory/Transactions';
import UserManagement from './pages/Admin/Users/List';
import ApprovalsList from './pages/Admin/Approvals/List';
import InspectionsList from './pages/Site/Inspections/List';
import CreateInspection from './pages/Site/Inspections/Create';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import PMDashboard from './pages/ProjectManager/Dashboard/PMDashboard';
import EngineerDashboard from './pages/Site/Dashboard/EngineerDashboard';
import StoreDashboard from './pages/Store/Dashboard/StoreDashboard';
import AdminLayout from './components/Layouts/AdminLayout';
import RequireRole from './components/RequireRole';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

          {/* Protected Routes (Admin/Manager) */}
          <Route element={
            <RequireRole roles={['SUPER_ADMIN', 'PROJECT_MANAGER', 'SITE_ENGINEER', 'STORE_KEEPER']}>
              <AdminLayout />
            </RequireRole>
          }>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/app" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Admin Only Routes */}
            <Route path="/admin/sites" element={
              <RequireRole roles={['SUPER_ADMIN']}>
                <SiteList />
              </RequireRole>
            } />
            <Route path="/admin/sites/create" element={
              <RequireRole roles={['SUPER_ADMIN']}>
                <CreateSite />
              </RequireRole>
            } />
            <Route path="/admin/approvals" element={<ApprovalsList />} />

            {/* Dashboard Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/pm/dashboard" element={<PMDashboard />} />
            <Route path="/site/dashboard" element={<EngineerDashboard />} />
            <Route path="/store/dashboard" element={<StoreDashboard />} />

            {/* Existing Routes */}
            <Route path="/pm/tasks" element={<TaskBoard />} />
            <Route path="/pm/tasks/board" element={<TaskBoard />} />
            <Route path="/store/inventory" element={<InventoryList />} />
            <Route path="/store/requests" element={<MaterialRequest />} />
            <Route path="/store/inventory/transactions" element={<TransactionHistory />} />
            <Route path="/site/inspections" element={<InspectionsList />} />
            <Route path="/site/inspections/create" element={<CreateInspection />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
