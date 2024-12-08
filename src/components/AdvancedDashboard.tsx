import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Video, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Calendar,
  Activity,
  Eye,
  MessageSquare
} from 'lucide-react';
import { useWebinar } from '../context/WebinarContext';
import { useAuth } from '../context/AuthContext';

const AdvancedDashboard: React.FC = () => {
  const { webinars } = useWebinar();
  const { currentUser } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [animatedStats, setAnimatedStats] = useState({
    totalWebinars: 0,
    activeWebinars: 0,
    totalViews: 0,
    totalRevenue: 0,
    averageWatchTime: 0,
    engagementRate: 0
  });

  // Simulated data for charts
  const chartData = {
    week: {
      views: [120, 145, 160, 180, 165, 190, 210],
      engagement: [65, 70, 75, 80, 75, 85, 90],
      revenue: [1200, 1500, 1400, 1800, 1600, 1900, 2100]
    },
    month: {
      views: [1200, 1450, 1600, 1800],
      engagement: [70, 75, 80, 85],
      revenue: [12000, 15000, 14000, 18000]
    }
  };

  useEffect(() => {
    // Animate stats from 0 to their final values
    const finalStats = {
      totalWebinars: webinars.length,
      activeWebinars: webinars.filter(w => {
        const now = new Date();
        return now >= w.schedule.startTime && now <= w.schedule.endTime;
      }).length,
      totalViews: 15780,
      totalRevenue: 25890,
      averageWatchTime: 45,
      engagementRate: 78
    };

    const animationDuration = 2000; // 2 seconds
    const steps = 60; // 60 frames
    const interval = animationDuration / steps;

    let currentStep = 0;

    const animation = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        totalWebinars: Math.round(finalStats.totalWebinars * progress),
        activeWebinars: Math.round(finalStats.activeWebinars * progress),
        totalViews: Math.round(finalStats.totalViews * progress),
        totalRevenue: Math.round(finalStats.totalRevenue * progress),
        averageWatchTime: Math.round(finalStats.averageWatchTime * progress),
        engagementRate: Math.round(finalStats.engagementRate * progress)
      });

      if (currentStep >= steps) {
        clearInterval(animation);
      }
    }, interval);

    return () => clearInterval(animation);
  }, [webinars]);

  const StatCard = ({ title, value, icon: Icon, color, prefix = '', suffix = '' }) => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const ChartCard = ({ title, data, icon: Icon, color }) => (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${color}`} />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="h-40 flex items-end gap-2">
        {data.map((value, index) => (
          <motion.div
            key={index}
            className={`w-full ${color} rounded-t`}
            initial={{ height: 0 }}
            animate={{ height: `${(value / Math.max(...data)) * 100}%` }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total de Webinars"
          value={animatedStats.totalWebinars}
          icon={Video}
          color="bg-blue-500"
        />
        <StatCard
          title="Webinars Ativos"
          value={animatedStats.activeWebinars}
          icon={Activity}
          color="bg-green-500"
        />
        <StatCard
          title="Total de Visualizações"
          value={animatedStats.totalViews}
          icon={Eye}
          color="bg-purple-500"
        />
        <StatCard
          title="Receita Total"
          value={animatedStats.totalRevenue}
          icon={DollarSign}
          color="bg-yellow-500"
          prefix="R$ "
        />
        <StatCard
          title="Tempo Médio de Visualização"
          value={animatedStats.averageWatchTime}
          icon={Clock}
          color="bg-indigo-500"
          suffix=" min"
        />
        <StatCard
          title="Taxa de Engajamento"
          value={animatedStats.engagementRate}
          icon={TrendingUp}
          color="bg-pink-500"
          suffix="%"
        />
      </div>

      {/* Period Selector */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setSelectedPeriod('week')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedPeriod === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Esta Semana
        </button>
        <button
          onClick={() => setSelectedPeriod('month')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedPeriod === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Este Mês
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Visualizações"
          data={chartData[selectedPeriod].views}
          icon={Eye}
          color="text-blue-500"
        />
        <ChartCard
          title="Engajamento"
          data={chartData[selectedPeriod].engagement}
          icon={MessageSquare}
          color="text-green-500"
        />
        <ChartCard
          title="Receita"
          data={chartData[selectedPeriod].revenue}
          icon={DollarSign}
          color="text-yellow-500"
        />
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          Atividade Recente
        </h3>
        <div className="space-y-4">
          {webinars.slice(0, 5).map((webinar, index) => (
            <motion.div
              key={webinar.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-gray-800">{webinar.title}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(webinar.schedule.startTime).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                new Date() >= webinar.schedule.startTime && new Date() <= webinar.schedule.endTime
                  ? 'bg-green-100 text-green-700'
                  : new Date() < webinar.schedule.startTime
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {new Date() >= webinar.schedule.startTime && new Date() <= webinar.schedule.endTime
                  ? 'Ao Vivo'
                  : new Date() < webinar.schedule.startTime
                  ? 'Agendado'
                  : 'Finalizado'}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedDashboard;