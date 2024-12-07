import React, { useState } from 'react';
import { Save, Clock, Type } from 'lucide-react';
import { WebinarTheme } from '../types/webinar';

interface WebinarSettingsManagerProps {
  title: string;
  description: string;
  theme: WebinarTheme;
  onUpdate: (updates: { title?: string; description?: string; theme?: WebinarTheme }) => void;
}

const WebinarSettingsManager: React.FC<WebinarSettingsManagerProps> = ({
  title,
  description,
  theme,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    title,
    description,
    timer: theme.timer || {
      showAt: { minutes: 0, seconds: 0 },
      duration: { minutes: 5, seconds: 0 },
      textColor: '#FFFFFF',
      backgroundColor: '#000000',
      opacity: '40',
      position: 'above' as const
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      title: formData.title,
      description: formData.description,
      theme: {
        ...theme,
        timer: formData.timer
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Type size={24} />
        Configurações do Webinar
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título do Webinar
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={20} />
            Configurações do Cronômetro
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mostrar após
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Minutos</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.timer.showAt.minutes}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      timer: {
                        ...prev.timer,
                        showAt: {
                          ...prev.timer.showAt,
                          minutes: parseInt(e.target.value)
                        }
                      }
                    }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Segundos</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.timer.showAt.seconds}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      timer: {
                        ...prev.timer,
                        showAt: {
                          ...prev.timer.showAt,
                          seconds: parseInt(e.target.value)
                        }
                      }
                    }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Minutos</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.timer.duration.minutes}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      timer: {
                        ...prev.timer,
                        duration: {
                          ...prev.timer.duration,
                          minutes: parseInt(e.target.value)
                        }
                      }
                    }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Segundos</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.timer.duration.seconds}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      timer: {
                        ...prev.timer,
                        duration: {
                          ...prev.timer.duration,
                          seconds: parseInt(e.target.value)
                        }
                      }
                    }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor do Texto
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.timer.textColor}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    timer: {
                      ...prev.timer,
                      textColor: e.target.value
                    }
                  }))}
                  className="h-10 w-20 rounded-md border-gray-300"
                />
                <input
                  type="text"
                  value={formData.timer.textColor}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    timer: {
                      ...prev.timer,
                      textColor: e.target.value
                    }
                  }))}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor de Fundo
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.timer.backgroundColor}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    timer: {
                      ...prev.timer,
                      backgroundColor: e.target.value
                    }
                  }))}
                  className="h-10 w-20 rounded-md border-gray-300"
                />
                <input
                  type="text"
                  value={formData.timer.backgroundColor}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    timer: {
                      ...prev.timer,
                      backgroundColor: e.target.value
                    }
                  }))}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opacidade do Fundo
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={parseInt(formData.timer.opacity)}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  timer: {
                    ...prev.timer,
                    opacity: e.target.value
                  }
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>0%</span>
                <span>{formData.timer.opacity}%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posição
              </label>
              <select
                value={formData.timer.position}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  timer: {
                    ...prev.timer,
                    position: e.target.value as WebinarTheme['timer']['position']
                  }
                }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="above">Acima do botão</option>
                <option value="below">Abaixo do botão</option>
                <option value="left">À esquerda do botão</option>
                <option value="right">À direita do botão</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save size={20} />
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default WebinarSettingsManager;