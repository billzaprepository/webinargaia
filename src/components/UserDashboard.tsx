import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Video, Users, BarChart2, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWebinar } from '../context/WebinarContext';

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total de Webinars</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalWebinars}</h3>
              </div>
              <Video className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Webinars Ativos</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.activeWebinars}</h3>
              </div>
              <Video className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total de Visualizações</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalViews}</h3>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Tempo Médio de Visualização</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {Math.round(stats.averageWatchTime)}min
                </h3>
              </div>
              <BarChart2 className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Video className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-800">Ações Rápidas</h2>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/webinar/new')}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Criar Novo Webinar
              </button>
              <button
                onClick={() => navigate('/admin/analytics')}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Ver Análises
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-800">Assinatura</h2>
            </div>
            {currentUser.subscription?.status === 'active' ? (
              <div>
                <p className="text-gray-600 mb-2">
                  Plano atual: <span className="font-semibold">{currentUser.subscription.planId}</span>
                </p>
                <p className="text-gray-600 mb-4">
                  Válido até: {new Date(currentUser.subscription.endDate).toLocaleDateString()}
                </p>
                <button
                  onClick={() => navigate('/admin/subscription')}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Gerenciar Assinatura
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">Você ainda não possui um plano ativo.</p>
                <button
                  onClick={() => navigate('/admin/plans')}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Ver Planos Disponíveis
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800">Configurações</h2>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/profile')}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <User size={18} />
                Editar Perfil
              </button>
              <button
                onClick={() => navigate('/admin/settings')}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Settings size={18} />
                Configurações Gerais
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;