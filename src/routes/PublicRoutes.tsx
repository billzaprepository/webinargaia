import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WebinarPage from '../pages/WebinarPage';
import LoginPage from '../pages/LoginPage';
import PlansPage from '../pages/PlansPage';

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/webinar/:slug" element={<WebinarPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/plans" element={<PlansPage />} />
    </Routes>
  );
};

export default PublicRoutes;