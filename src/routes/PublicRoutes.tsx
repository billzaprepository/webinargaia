import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WebinarPage from '../pages/WebinarPage';

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/:slug" element={<WebinarPage />} />
    </Routes>
  );
};

export default PublicRoutes;