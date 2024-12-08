import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video,
  Activity,
  Eye,
  Clock,
  TrendingUp,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useWebinar } from '../context/WebinarContext';
import { useAuth } from '../context/AuthContext';

const CollaboratorDashboard: React.FC = () => {
  const { webinars } = useWebinar();
  const { currentUser } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Memoize user webinars to prevent unnecessary recalculations
  const userWebinars = useMemo(() => {
    return webinars.filter(w => w.createdBy === currentUser?.id);
  }, [webinars, currentUser?.id]);

  // Memoize stats calculation
  const stats = useMemo(() => {
    const activeWebinars = userWebinars.filter(w => {
      const now = new Date();
      return now >= w.schedule.startTime && now <= w.schedule.endTime;
    }).length;

    return {
      totalWebinars: userWebinars.length,
      activeWebinars,
      totalViews: 1580,
      averageWatchTime: 42,
      engagementRate: 75
    };
  }, [userWebinars]);

  // Memoize chart data
  const chartData = useMemo(() => ({
    week: {
      views: [120, 145, 160, 180, 165, 190, 210],
      engagement: [65, 70, 75, 80, 75, 85, 90],
      watchTime: [35, 42, 38, 45, 40, 43, 48]
    },
    month: {
      views: [1200, 1450, 1600, 1800],
      engagement: [70, 75, 80, 85],
      watchTime: [40, 42, 45, 43]
    }
  }), []);

  const StatCard = useCallback(({ title, value, icon: Icon, color, suffix = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-lg shadow-lg p-6"
      layout
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <motion.p 
            className="text-2xl font-bold mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </motion.p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  ), []);

  const ChartCard = useCallback(({ title, data, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-lg shadow-lg p-6"
      layout
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${color}`} />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="h-40 flex items-end gap-2">
        <AnimatePresence mode="wait">
          {data.map((value, index) => (
            <motion.div
              key={`${selectedPeriod}-${index}`}
              className={`w-full ${color} rounded-t`}
              initial={{ height: 0 }}
              animate={{ height: `${(value / Math.max(...data)) * 100}%` }}
              exit={{ height: 0 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.05,
                ease: "easeOut"
              }}
              layout
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  ), [selectedPeriod]);

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      layout
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total de Webinars"
          value={stats.totalWebinars}
          icon={Video}
          color="bg-blue-500"
        />
        <StatCard
          title="Webinars Ativos"
          value={stats.activeWebinars}
          icon={Activity}
          color="bg-green-500"
        />
        <StatCard
          title="Total de Visualizações"
          value={stats.totalViews}
          icon={Eye}
          color="bg-purple-500"
        />
        <StatCard
          title="Tempo Médio de Visualização"
          value={stats.averageWatchTime}
          icon={Clock}
          color="bg-indigo-500"
          suffix=" min"
        />
        <StatCard
          title="Taxa de Engajamento"
          value={stats.engagementRate}
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
      <AnimatePresence mode="wait">
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
            title="Tempo de Visualização"
            data={chartData[selectedPeriod].watchTime}
            icon={Clock}
            color="text-indigo-500"
          />
        </div>
      </AnimatePresence>

      {/* Recent Webinars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
        layout
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          Meus Webinars Recentes
        </h3>
        <AnimatePresence>
          <div className="space-y-4">
            {userWebinars.slice(0, 5).map((webinar, index) => (
              <motion.div
                key={webinar.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                layout
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
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CollaboratorDashboard;