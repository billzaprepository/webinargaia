import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WebinarProvider } from './context/WebinarContext';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import WebinarPage from './pages/WebinarPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import PlansPage from './pages/PlansPage';
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <WebinarProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/webinar/:slug" element={<WebinarPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/plans" element={<PlansPage />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<PrivateLayout />}>
                <Route path="/admin/*" element={<AdminPage />} />
              </Route>

              <Route path="/" element={<Navigate to="/admin" replace />} />
            </Routes>
          </BrowserRouter>
        </WebinarProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;