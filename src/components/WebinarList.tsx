import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Video, Calendar, ExternalLink } from 'lucide-react';
import { useWebinar } from '../context/WebinarContext';
import { useAuth } from '../context/AuthContext';

const WebinarList: React.FC = () => {
  const { webinars, removeWebinar, canManageWebinar } = useWebinar();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewWebinar = (slug: string) => {
    navigate(`/webinar/${slug}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Video size={24} />
          {currentUser?.role === 'admin' ? 'Todos os Webinars' : 'Meus Webinars'}
        </h2>
        <Link
          to="/admin/webinar/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Criar Novo Webinar
        </Link>
      </div>

      <div className="space-y-4">
        {webinars.map(webinar => (
          <div key={webinar.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={webinar.thumbnail}
                  alt={webinar.title}
                  className="w-24 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{webinar.title}</h3>
                  <p className="text-sm text-gray-600">{webinar.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{formatDate(webinar.schedule.startTime)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewWebinar(webinar.slug)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg flex items-center gap-1"
                  title="Acessar Webinar"
                >
                  <ExternalLink size={20} />
                  <span className="text-sm font-medium">Acessar</span>
                </button>
                {canManageWebinar(webinar.id) && (
                  <>
                    <Link
                      to={`/admin/webinar/${webinar.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Editar Webinar"
                    >
                      <Edit2 size={20} />
                    </Link>
                    <button
                      onClick={() => removeWebinar(webinar.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      title="Excluir Webinar"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {webinars.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum webinar encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default WebinarList;