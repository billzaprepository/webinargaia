import React, { useState } from 'react';
import { Code, Save, AlertCircle } from 'lucide-react';
import { useWebinar } from '../context/WebinarContext';

interface GTMSettings {
  containerId: string;
  enabled: boolean;
  trackPageView: boolean;
  trackEvents: boolean;
  trackEcommerce: boolean;
}

const GoogleTagManagerSettings: React.FC = () => {
  const { webinar, updateWebinar } = useWebinar();
  const [settings, setSettings] = useState<GTMSettings>({
    containerId: webinar?.gtm?.containerId || '',
    enabled: webinar?.gtm?.enabled || false,
    trackPageView: webinar?.gtm?.trackPageView || true,
    trackEvents: webinar?.gtm?.trackEvents || true,
    trackEcommerce: webinar?.gtm?.trackEcommerce || true
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    updateWebinar(webinar.id, {
      gtm: settings
    });
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Code size={24} />
        Integração Google Tag Manager
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Container ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={settings.containerId}
              onChange={(e) => setSettings(prev => ({ ...prev, containerId: e.target.value }))}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: GTM-XXXXXXX"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Encontre seu Container ID no Google Tag Manager
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => setSettings(prev => ({ ...prev, enabled: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Ativar Google Tag Manager</span>
          </label>

          <div className="pl-6 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.trackPageView}
                onChange={(e) => setSettings(prev => ({ ...prev, trackPageView: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={!settings.enabled}
              />
              <span className="text-sm text-gray-700">Rastrear visualizações de página</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.trackEvents}
                onChange={(e) => setSettings(prev => ({ ...prev, trackEvents: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={!settings.enabled}
              />
              <span className="text-sm text-gray-700">Rastrear eventos personalizados</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.trackEcommerce}
                onChange={(e) => setSettings(prev => ({ ...prev, trackEcommerce: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={!settings.enabled}
              />
              <span className="text-sm text-gray-700">Rastrear eventos de e-commerce</span>
            </label>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Importante:</p>
            <p>O Google Tag Manager permitirá que você:</p>
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>Gerencie todas as suas tags em um único lugar</li>
              <li>Implemente tags sem alterar o código do site</li>
              <li>Configure regras de disparo avançadas</li>
              <li>Integre com Google Analytics e outras ferramentas</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end">
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
      </div>
    </div>
  );
};

export default GoogleTagManagerSettings;