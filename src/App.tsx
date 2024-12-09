import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WebinarProvider } from './context/WebinarContext';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import PublicRoutes from './routes/PublicRoutes';
import PrivateRoutes from './routes/PrivateRoutes';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <WebinarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/*" element={<PrivateRoutes />} />
              <Route path="/webinar/*" element={<PublicRoutes />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </WebinarProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;