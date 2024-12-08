import React from 'react';
import { Radio } from 'lucide-react';

interface WebinarStatusBadgeProps {
  status: 'scheduled' | 'live' | 'ended';
}

const WebinarStatusBadge: React.FC<WebinarStatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-700';
      case 'ended':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'live':
        return 'Ao Vivo';
      case 'ended':
        return 'Finalizado';
      default:
        return 'Agendado';
    }
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusStyles()}`}>
      {status === 'live' && <Radio size={14} className="animate-pulse" />}
      {getStatusText()}
    </span>
  );
};

export default WebinarStatusBadge;