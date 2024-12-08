import React, { useState } from 'react';
import { Code, Save, AlertCircle } from 'lucide-react';
import { useWebinar } from '../context/WebinarContext';

interface MetaPixelSettings {
  pixelId: string;
  enabled: boolean;
  trackPageView: boolean;
  trackConversion: boolean;
  trackSubscription: boolean;
}

const MetaPixelSettings: React.FC = () => {
  const { webinar, updateWebinar } = useWebinar();
  const [settings, setSettings] = useState<MetaPixelSettings>({
    pixelId: webinar?.metaPixel?.pixelId || '',
    enabled: webinar?.metaPixel?.enabled || false,
    trackPageView: webinar?.metaPixel?.trackPageView || true,
    trackConversion: webinar?.metaPixel?.trackConversion || true,
    trackSubscription: webinar?.metaPixel?.trackSubscription || true
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    updateWebinar(webinar.id, {
      metaPixel: settings
    });
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Code size={24} />
        Integração Meta Pixel
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID do Pixel
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={settings.pixelId}
              onChange={(e) => setSettings(prev => ({ ...prev, pixelId: e.target.value }))}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: 123456789012345"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Encontre seu Pixel ID no Gerenciador de Eventos do Facebook
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
            <span className="text-sm text-gray-700">Ativar Meta Pixel</span>
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
                checked={settings.trackConversion}
                onChange={(e) => setSettings(prev => ({ ...prev, trackConversion: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={!settings.enabled}
              />
              <span className="text-sm text-gray-700">Rastrear conversões</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.trackSubscription}
                onChange={(e) => setSettings(prev => ({ ...prev, trackSubscription: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={!settings.enabled}
              />
              <span className="text-sm text-gray-700">Rastrear assinaturas</span>
            </label>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Importante:</p>
            <p>O Meta Pixel ajudará você a:</p>
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>Medir o retorno do seu investimento em anúncios</li>
              <li>Criar públicos personalizados para remarketing</li>
              <li>Otimizar suas campanhas de forma mais eficiente</li>
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

export default MetaPixelSettings;