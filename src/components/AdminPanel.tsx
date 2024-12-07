import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Calendar, MessageSquare, Video, Palette, MousePointer, ArrowLeft } from 'lucide-react';
import { useWebinar } from '../context/WebinarContext';
import VideoUpload from './VideoUpload';
import ChatManager from './ChatManager';
import CTAManager from './CTAManager';
import ThemeManager from './ThemeManager';

const AdminPanel: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { webinars, updateWebinar } = useWebinar();
  const webinar = webinars.find(w => w.id === id);

  if (!webinar) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Webinar não encontrado.</p>
      </div>
    );
  }

  const handleDateChange = (field: 'startTime' | 'endTime', value: string) => {
    updateWebinar(webinar.id, {
      schedule: {
        ...webinar.schedule,
        [field]: new Date(value)
      }
    });
  };

  const formatDateTimeLocal = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar ao Menu</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <Video size={24} />
          Vídeo do Webinar
        </h2>
        <VideoUpload
          onVideoChange={(file) => updateWebinar(webinar.id, { video: file })}
          currentVideo={webinar.video}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <Calendar size={24} />
          Agendamento do Webinar
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Início do Webinar
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="datetime-local"
                  value={formatDateTimeLocal(webinar.schedule.startTime)}
                  onChange={(e) => handleDateChange('startTime', e.target.value)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fim do Webinar
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="datetime-local"
                  value={formatDateTimeLocal(webinar.schedule.endTime)}
                  onChange={(e) => handleDateChange('endTime', e.target.value)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Link do Webinar</h3>
            <div className="flex items-center gap-2 bg-white p-3 rounded border">
              <code className="text-sm flex-1">
                {window.location.origin}/webinar/{webinar.slug}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/webinar/${webinar.slug}`)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Copiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <MessageSquare size={24} />
          Gerenciar Mensagens do Chat
        </h2>
        <ChatManager
          messages={webinar.messages}
          onUpdate={(messages) => updateWebinar(webinar.id, { messages })}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <MousePointer size={24} />
          Botões de CTA
        </h2>
        <CTAManager
          ctaButtons={webinar.ctaButtons || []}
          onUpdate={(buttons) => updateWebinar(webinar.id, { ctaButtons: buttons })}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <Palette size={24} />
          Personalização do Tema
        </h2>
        <ThemeManager
          theme={webinar.theme}
          onUpdate={(theme) => updateWebinar(webinar.id, { theme })}
        />
      </div>
    </div>
  );
};

export default AdminPanel;