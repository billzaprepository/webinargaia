import React from 'react';
import { Clock } from 'lucide-react';
import { WebinarTheme } from '../types/webinar';

interface TimerSettingsProps {
  theme: WebinarTheme;
  onUpdate: (theme: WebinarTheme) => void;
}

const TimerSettings: React.FC<TimerSettingsProps> = ({ theme, onUpdate }) => {
  const handleChange = (key: keyof WebinarTheme['timer'], value: string | object) => {
    onUpdate({
      ...theme,
      timer: {
        ...theme.timer,
        [key]: value
      }
    });
  };

  const handleDurationChange = (type: 'minutes' | 'seconds', value: number) => {
    const currentDuration = theme.timer?.duration || { minutes: 0, seconds: 0 };
    handleChange('duration', {
      ...currentDuration,
      [type]: value
    });
  };

  const handleShowAtChange = (type: 'minutes' | 'seconds', value: number) => {
    const currentShowAt = theme.timer?.showAt || { minutes: 0, seconds: 0 };
    handleChange('showAt', {
      ...currentShowAt,
      [type]: value
    });
  };

  return (
    <div className="space-y-6">
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
                value={theme.timer?.showAt?.minutes || 0}
                onChange={(e) => handleShowAtChange('minutes', parseInt(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Segundos</label>
              <input
                type="number"
                min="0"
                max="59"
                value={theme.timer?.showAt?.seconds || 0}
                onChange={(e) => handleShowAtChange('seconds', parseInt(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duração do Cronômetro
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Minutos</label>
              <input
                type="number"
                min="0"
                max="59"
                value={theme.timer?.duration?.minutes || 0}
                onChange={(e) => handleDurationChange('minutes', parseInt(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Segundos</label>
              <input
                type="number"
                min="0"
                max="59"
                value={theme.timer?.duration?.seconds || 0}
                onChange={(e) => handleDurationChange('seconds', parseInt(e.target.value))}
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
              value={theme.timer?.textColor || '#FFFFFF'}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="h-10 w-20 rounded-md border-gray-300"
            />
            <input
              type="text"
              value={theme.timer?.textColor || '#FFFFFF'}
              onChange={(e) => handleChange('textColor', e.target.value)}
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
              value={theme.timer?.backgroundColor || '#000000'}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="h-10 w-20 rounded-md border-gray-300"
            />
            <input
              type="text"
              value={theme.timer?.backgroundColor || '#000000'}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
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
            value={parseInt(theme.timer?.opacity || '40')}
            onChange={(e) => handleChange('opacity', e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>0%</span>
            <span>{theme.timer?.opacity || '40'}%</span>
            <span>100%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Posição
          </label>
          <select
            value={theme.timer?.position || 'above'}
            onChange={(e) => handleChange('position', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="above">Acima do botão</option>
            <option value="below">Abaixo do botão</option>
            <option value="left">À esquerda do botão</option>
            <option value="right">À direita do botão</option>
          </select>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Visualização</h4>
        <div className="flex items-center justify-center p-4 bg-gray-800 rounded-lg">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
            style={{
              color: theme.timer?.textColor || '#FFFFFF',
              backgroundColor: `${theme.timer?.backgroundColor || '#000000'}${Math.round(parseInt(theme.timer?.opacity || '40') * 2.55).toString(16).padStart(2, '0')}`,
            }}
          >
            <Clock size={14} />
            <span>
              {String(theme.timer?.duration?.minutes || 0).padStart(2, '0')}:
              {String(theme.timer?.duration?.seconds || 0).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerSettings;