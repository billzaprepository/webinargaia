import React from 'react';
import { Clock } from 'lucide-react';
import { WebinarTheme } from '../types/webinar';

interface TimerSettingsProps {
  timer: WebinarTheme['timer'];
  onUpdate: (timer: WebinarTheme['timer']) => void;
}

const TimerSettings: React.FC<TimerSettingsProps> = ({ timer, onUpdate }) => {
  const handleChange = (field: string, value: any) => {
    onUpdate({
      ...timer,
      [field]: value
    });
  };

  const handleTimeChange = (type: 'showAt' | 'duration', field: 'minutes' | 'seconds', value: number) => {
    onUpdate({
      ...timer,
      [type]: {
        ...timer?.[type],
        [field]: value
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Clock size={24} />
        Configurações do Cronômetro
      </h2>

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
                value={timer?.showAt?.minutes || 0}
                onChange={(e) => handleTimeChange('showAt', 'minutes', parseInt(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Segundos</label>
              <input
                type="number"
                min="0"
                max="59"
                value={timer?.showAt?.seconds || 0}
                onChange={(e) => handleTimeChange('showAt', 'seconds', parseInt(e.target.value))}
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
                value={timer?.duration?.minutes || 0}
                onChange={(e) => handleTimeChange('duration', 'minutes', parseInt(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Segundos</label>
              <input
                type="number"
                min="0"
                max="59"
                value={timer?.duration?.seconds || 0}
                onChange={(e) => handleTimeChange('duration', 'seconds', parseInt(e.target.value))}
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
              value={timer?.textColor || '#FFFFFF'}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="h-10 w-20 rounded-md border-gray-300"
            />
            <input
              type="text"
              value={timer?.textColor || '#FFFFFF'}
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
              value={timer?.backgroundColor || '#000000'}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="h-10 w-20 rounded-md border-gray-300"
            />
            <input
              type="text"
              value={timer?.backgroundColor || '#000000'}
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
            value={parseInt(timer?.opacity || '40')}
            onChange={(e) => handleChange('opacity', e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>0%</span>
            <span>{timer?.opacity || '40'}%</span>
            <span>100%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Posição
          </label>
          <select
            value={timer?.position || 'above'}
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
              color: timer?.textColor || '#FFFFFF',
              backgroundColor: `${timer?.backgroundColor || '#000000'}${Math.round(parseInt(timer?.opacity || '40') * 2.55).toString(16).padStart(2, '0')}`,
            }}
          >
            <Clock size={14} />
            <span>
              {String(timer?.duration?.minutes || 0).padStart(2, '0')}:
              {String(timer?.duration?.seconds || 0).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerSettings;