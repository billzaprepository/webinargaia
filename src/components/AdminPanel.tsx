import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Calendar, MessageSquare, Video, Palette, MousePointer, ArrowLeft, Save } from 'lucide-react';
import { useWebinar } from '../context/WebinarContext';
import VideoUpload from './VideoUpload';
import ChatManager from './ChatManager';
import CTAManager from './CTAManager';
import ThemeManager from './ThemeManager';
import WebinarSettingsManager from './WebinarSettingsManager';

const AdminPanel: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { webinars, updateWebinar, canManageWebinar } = useWebinar();
  const webinar = webinars.find(w => w.id === id);
  const [isSaving, setIsSaving] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    startTime: webinar ? new Date(webinar.schedule.startTime).toISOString().slice(0, 16) : '',
    endTime: webinar ? new Date(webinar.schedule.endTime).toISOString().slice(0, 16) : ''
  });

  if (!webinar) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Webinar não encontrado.</p>
      </div>
    );
  }

  if (!canManageWebinar(webinar.id)) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Você não tem permissão para editar este webinar.</p>
      </div>
    );
  }

  const handleDateChange = (field: 'startTime' | 'endTime', value: string) => {
    setScheduleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    const startTime = new Date(scheduleData.startTime);
    const endTime = new Date(scheduleData.endTime);

    updateWebinar(webinar.id, {
      schedule: {
        ...webinar.schedule,
        startTime,
        endTime
      }
    });

    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
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

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
            isSaving 
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSaving ? (
            <>
              <Save size={20} className="animate-pulse" />
              Salvando...
            </>
          ) : (
            <>
              <Save size={20} />
              Salvar Alterações
            </>
          )}
        </button>
      </div>

      <WebinarSettingsManager
        title={webinar.title}
        description={webinar.description}
        theme={webinar.theme}
        onUpdate={(updates) => updateWebinar(webinar.id, updates)}
      />

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
                  value={scheduleData.startTime}
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
                  value={scheduleData.endTime}
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
                onClick={() => navigate(`/webinar/${webinar.slug}`)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <span>Acessar</span>
                <MousePointer size={14} />
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
          ctaButtons={webinar.ctaButtons}
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