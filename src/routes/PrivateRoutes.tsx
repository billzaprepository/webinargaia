import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminPage from '../pages/AdminPage';

const PrivateRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/*" element={<AdminPage />} />
    </Routes>
  );
};

export default PrivateRoutes;