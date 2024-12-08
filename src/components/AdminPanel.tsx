import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useWebinar } from '../context/WebinarContext';
import WebinarBasicSettings from './WebinarBasicSettings';
import VideoUpload from './VideoUpload';
import WebinarSchedule from './WebinarSchedule';
import ChatManager from './ChatManager';
import CTAManager from './CTAManager';
import ThemeManager from './ThemeManager';
import TimerSettings from './TimerSettings';

const AdminPanel: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { webinars, updateWebinar, canManageWebinar } = useWebinar();
  const [isSaving, setIsSaving] = useState(false);

  const webinar = webinars.find(w => w.id === id);

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

  const handleSave = () => {
    setIsSaving(true);
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
          <Save size={20} className={isSaving ? 'animate-pulse' : ''} />
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="space-y-6">
        <WebinarBasicSettings
          title={webinar.title}
          description={webinar.description}
          onUpdate={(updates) => updateWebinar(webinar.id, updates)}
        />

        <WebinarSchedule
          schedule={webinar.schedule}
          onUpdate={(schedule) => updateWebinar(webinar.id, { schedule })}
        />

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Vídeo do Webinar</h2>
          <VideoUpload
            onVideoChange={(file) => updateWebinar(webinar.id, { video: file })}
            currentVideo={webinar.video}
          />
        </div>

        <ChatManager
          messages={webinar.messages}
          onUpdate={(messages) => updateWebinar(webinar.id, { messages })}
        />

        <CTAManager
          ctaButtons={webinar.ctaButtons}
          onUpdate={(buttons) => updateWebinar(webinar.id, { ctaButtons: buttons })}
        />

        <TimerSettings
          timers={webinar.theme.timers || []}
          onUpdate={(timers) => updateWebinar(webinar.id, { 
            theme: { ...webinar.theme, timers } 
          })}
        />

        <ThemeManager
          theme={webinar.theme}
          onUpdate={(theme) => updateWebinar(webinar.id, { theme })}
        />
      </div>
    </div>
  );
};

export default AdminPanel;