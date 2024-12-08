import React from 'react';
import { Video, Activity, Eye, Clock } from 'lucide-react';
import StatCard from '../stats/StatCard';
import { Webinar } from '../../../types/webinar';

interface DashboardStatsProps {
  webinars: Webinar[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ webinars }) => {
  const stats = {
    totalWebinars: webinars.length,
    activeWebinars: webinars.filter(w => {
      const now = new Date();
      return now >= w.schedule.startTime && now <= w.schedule.endTime;
    }).length,
    totalViews: webinars.reduce((sum, w) => sum + w.analytics.views, 0),
    avgWatchTime: Math.floor(
      webinars.reduce((sum, w) => sum + w.analytics.watchTime, 0) / 
      (webinars.length || 1)
    ),
    avgEngagement: Math.floor(
      webinars.reduce((sum, w) => sum + w.analytics.engagement, 0) / 
      (webinars.length || 1)
    )
  };

  return (
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
        value={stats.totalViews.toLocaleString()}
        icon={Eye}
        color="bg-purple-500"
      />
      <StatCard
        title="Tempo Médio de Visualização"
        value={`${stats.avgWatchTime} min`}
        icon={Clock}
        color="bg-indigo-500"
      />
      <StatCard
        title="Taxa de Engajamento"
        value={`${stats.avgEngagement}%`}
        icon={Activity}
        color="bg-pink-500"
      />
    </div>
  );
};

export default DashboardStats;