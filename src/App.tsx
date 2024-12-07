import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WebinarProvider } from './context/WebinarContext';
import { AuthProvider } from './context/AuthContext';
import WebinarPage from './pages/WebinarPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <WebinarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/webinar/:slug" element={<WebinarPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </Routes>
        </BrowserRouter>
      </WebinarProvider>
    </AuthProvider>
  );
}

export default App;