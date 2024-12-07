import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebinar } from '../context/WebinarContext';
import { useSettings } from '../context/SettingsContext';
import UserManagement from './UserManagement';
import PlansManagement from './PlansManagement';
import { BarChart2, Users, Video, DollarSign, AlertCircle, CheckCircle, XCircle, Search } from 'lucide-react';

const UserManagementDashboard: React.FC = () => {
  const { users, currentUser } = useAuth();
  const { webinars } = useWebinar();
  const { settings } = useSettings();

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.subscription?.status === 'active').length,
    trialUsers: users.filter(u => u.subscription?.status === 'trial').length,
    blockedUsers: users.filter(u => u.subscription?.status === 'blocked').length,
    totalWebinars: webinars.length,
    totalRevenue: users.reduce((acc, user) => {
      const plan = settings.plans.find(p => p.id === user.subscription?.planId);
      return acc + (plan?.price || 0);
    }, 0)
  };

  const StatCard = ({ title, value, icon: Icon, color }: { 
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total de Usuários"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Usuários Ativos"
          value={stats.activeUsers}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Em Período de Teste"
          value={stats.trialUsers}
          icon={AlertCircle}
          color="bg-yellow-500"
        />
        <StatCard
          title="Usuários Bloqueados"
          value={stats.blockedUsers}
          icon={XCircle}
          color="bg-red-500"
        />
        <StatCard
          title="Total de Webinars"
          value={stats.totalWebinars}
          icon={Video}
          color="bg-purple-500"
        />
        <StatCard
          title="Receita Mensal"
          value={`R$ ${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="bg-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserManagement />
        <PlansManagement />
      </div>
    </div>
  );
};

export default UserManagementDashboard;