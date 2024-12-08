import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';
import UserManagementDashboard from '../components/UserManagementDashboard';
import CollaboratorDashboard from '../components/CollaboratorDashboard';
import WebinarList from '../components/WebinarList';
import WebinarForm from '../components/WebinarForm';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChevronRight } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
              <div className="text-sm text-gray-500">
                Bem-vindo, <span className="font-medium text-gray-900">{currentUser?.name}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
      </main>
    </div>
  );
};

export default AdminPage;