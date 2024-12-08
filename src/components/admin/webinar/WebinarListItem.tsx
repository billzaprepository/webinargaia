import React from 'react';
import { Eye, Clock, MessageSquare } from 'lucide-react';
import { Webinar } from '../../../types/webinar';
import WebinarStatusBadge from './WebinarStatusBadge';

interface WebinarListItemProps {
  webinar: Webinar;
}

const WebinarListItem: React.FC<WebinarListItemProps> = ({ webinar }) => {
  const now = new Date();
  const status = now >= webinar.schedule.startTime && now <= webinar.schedule.endTime 
    ? 'live' 
    : now > webinar.schedule.endTime 
    ? 'ended' 
    : 'scheduled';

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <h4 className="font-medium text-gray-800">{webinar.title}</h4>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {webinar.analytics.views.toLocaleString()} visualizações
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {webinar.analytics.watchTime}min média
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare size={14} />
            {webinar.analytics.chatMessages} mensagens
          </span>
        </div>
      </div>
      <WebinarStatusBadge status={status} />
    </div>
  );
};

export default WebinarListItem;