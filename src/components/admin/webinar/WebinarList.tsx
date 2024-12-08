import React from 'react';
import { Video, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WebinarListItem from './WebinarListItem';
import { Webinar } from '../../../types/webinar';

interface WebinarListProps {
  webinars: Webinar[];
  title?: string;
}

const WebinarList: React.FC<WebinarListProps> = ({ webinars, title = "Webinars Recentes" }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={() => navigate('/admin/webinar/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Novo Webinar
        </button>
      </div>

      {webinars.length > 0 ? (
        <div className="space-y-4">
          {webinars.map(webinar => (
            <WebinarListItem key={webinar.id} webinar={webinar} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum webinar encontrado
          </h3>
          <p className="text-gray-500">
            Comece criando seu primeiro webinar para ver as estatísticas aqui.
          </p>
        </div>
      )}
    </div>
  );
};

export default WebinarList;