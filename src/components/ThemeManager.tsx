import React from 'react';
import { Palette } from 'lucide-react';
import { WebinarTheme } from '../types/webinar';

interface ThemeManagerProps {
  theme: WebinarTheme;
  onUpdate: (theme: WebinarTheme) => void;
}

const ThemeManager: React.FC<ThemeManagerProps> = ({ theme, onUpdate }) => {
  const handleChange = (key: keyof WebinarTheme, value: string) => {
    onUpdate({
      ...theme,
      [key]: value
    });
  };

  const fonts = [
    'Inter, sans-serif',
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Georgia, serif',
    'Verdana, sans-serif',
    'Roboto, sans-serif'
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cor Principal
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={theme.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="h-10 w-20 rounded-md border-gray-300"
            />
            <input
              type="text"
              value={theme.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
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
              value={theme.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="h-10 w-20 rounded-md border-gray-300"
            />
            <input
              type="text"
              value={theme.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cor do Cabeçalho
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={theme.headerColor}
              onChange={(e) => handleChange('headerColor', e.target.value)}
              className="h-10 w-20 rounded-md border-gray-300"
            />
            <input
              type="text"
              value={theme.headerColor}
              onChange={(e) => handleChange('headerColor', e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cor de Fundo do Chat
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={theme.chatBackgroundColor}
              onChange={(e) => handleChange('chatBackgroundColor', e.target.value)}
              className="h-10 w-20 rounded-md border-gray-300"
            />
            <input
              type="text"
              value={theme.chatBackgroundColor}
              onChange={(e) => handleChange('chatBackgroundColor', e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cor do Texto do Chat
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={theme.chatTextColor}
              onChange={(e) => handleChange('chatTextColor', e.target.value)}
              className="h-10 w-20 rounded-md border-gray-300"
            />
            <input
              type="text"
              value={theme.chatTextColor}
              onChange={(e) => handleChange('chatTextColor', e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fonte
          </label>
          <select
            value={theme.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {fonts.map(font => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font.split(',')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Visualização</h3>
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: theme.backgroundColor,
            color: theme.primaryColor,
            fontFamily: theme.fontFamily
          }}
        >
          <div
            className="p-3 rounded-lg mb-3"
            style={{ backgroundColor: theme.headerColor }}
          >
            <h4 className="font-bold">Exemplo de Cabeçalho</h4>
          </div>
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: theme.chatBackgroundColor,
              color: theme.chatTextColor
            }}
          >
            <p>Exemplo de mensagem no chat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeManager;