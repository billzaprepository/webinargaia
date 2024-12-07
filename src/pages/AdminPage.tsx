import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';
import UserManagement from '../components/UserManagement';
import WebinarList from '../components/WebinarList';
import WebinarForm from '../components/WebinarForm';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Logado como: <span className="font-medium">{currentUser?.name}</span>
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

        <Routes>
          <Route path="/" element={
            <>
              {currentUser?.role === 'admin' && <UserManagement />}
              <WebinarList />
            </>
          } />
          <Route path="/webinar/new" element={<WebinarForm />} />
          <Route path="/webinar/:id" element={<AdminPanel />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;