import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Video, Users, BarChart2, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWebinar } from '../context/WebinarContext';
import SubscriptionStatus from './SubscriptionStatus';

const UserDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { webinars } = useWebinar();
  const navigate = useNavigate();

  if (!currentUser) {
    return null;
  }

  const userWebinars = webinars.filter(w => w.createdBy === currentUser.id);

  const stats = {
    totalWebinars: userWebinars.length,
    activeWebinars: userWebinars.filter(w => w.isActive).length,
    totalViews: userWebinars.reduce((acc, w) => acc + (w.analytics?.totalViews || 0), 0),
    averageWatchTime: userWebinars.reduce((acc, w) => acc + (w.analytics?.averageWatchTime || 0), 0) / userWebinars.length || 0
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Bem-vindo, {currentUser.name}!</h1>
          <p className="text-gray-600">
            {currentUser.subscription?.status === 'active' 
              ? `Plano atual: ${currentUser.subscription.planId}`
              : 'Nenhum plano ativo'}
          </p>
        </div>

        <SubscriptionStatus user={currentUser} />

        {/* Rest of the dashboard content remains the same */}
        {/* ... */}
      </div>
    </div>
  );
};

export default UserDashboard;