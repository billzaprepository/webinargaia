import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import UserManagementDashboard from '../components/UserManagementDashboard';
import CollaboratorDashboard from '../components/CollaboratorDashboard';
import WebinarList from '../components/WebinarList';
import WebinarForm from '../components/WebinarForm';
import AdminPanel from '../components/AdminPanel';
import { useAuth } from '../context/AuthContext';

const AdminPage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={
          <div className="space-y-8">
            {currentUser?.role === 'admin' ? (
              <UserManagementDashboard />
            ) : (
              <CollaboratorDashboard />
            )}
            <WebinarList />
          </div>
        } />
        <Route path="/webinar/new" element={<WebinarForm />} />
        <Route path="/webinar/:id" element={<AdminPanel />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPage;