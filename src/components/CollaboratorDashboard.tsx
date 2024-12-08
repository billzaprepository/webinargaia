import React, { useEffect } from 'react';
import { useWebinar } from '../context/WebinarContext';
import { useAuth } from '../context/AuthContext';
import DashboardStats from './admin/dashboard/DashboardStats';
import WebinarList from './admin/webinar/WebinarList';

const CollaboratorDashboard: React.FC = () => {
  const { webinars, updateAnalytics } = useWebinar();
  const { currentUser } = useAuth();
  
  // Get only webinars created by the current user
  const userWebinars = webinars.filter(w => w.createdBy === currentUser?.id);

  // Update analytics data periodically
  useEffect(() => {
    userWebinars.forEach(webinar => {
      updateAnalytics(webinar.id);
    });

    const interval = setInterval(() => {
      userWebinars.forEach(webinar => {
        updateAnalytics(webinar.id);
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [userWebinars.length]);

  return (
    <div className="space-y-8">
      <DashboardStats webinars={userWebinars} />
      <WebinarList webinars={userWebinars} title="Meus Webinars Recentes" />
    </div>
  );
};

export default CollaboratorDashboard;