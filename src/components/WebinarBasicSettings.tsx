import React from 'react';
import { Type } from 'lucide-react';

interface WebinarBasicSettingsProps {
  title: string;
  description: string;
  onUpdate: (updates: { title?: string; description?: string }) => void;
}

const WebinarBasicSettings: React.FC<WebinarBasicSettingsProps> = ({
  title,
  description,
  onUpdate
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Type size={24} />
        Configurações do Webinar
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título do Webinar
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default WebinarBasicSettings;