import React from 'react';
import { Video, Activity, Eye, Clock, MessageSquare } from 'lucide-react';
import StatCard from './StatCard';
import { Webinar } from '../../../types/webinar';

interface WebinarStatsProps {
  webinar: Webinar;
}

const WebinarStats: React.FC<WebinarStatsProps> = ({ webinar }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Visualizações"
        value={webinar.analytics.views.toLocaleString()}
        icon={Eye}
        color="bg-blue-500"
      />
      <StatCard
        title="Tempo Médio"
        value={`${webinar.analytics.watchTime}min`}
        icon={Clock}
        color="bg-green-500"
      />
      <StatCard
        title="Engajamento"
        value={`${webinar.analytics.engagement}%`}
        icon={Activity}
        color="bg-purple-500"
      />
      <StatCard
        title="Mensagens"
        value={webinar.analytics.chatMessages}
        icon={MessageSquare}
        color="bg-pink-500"
      />
    </div>
  );
};

export default WebinarStats;