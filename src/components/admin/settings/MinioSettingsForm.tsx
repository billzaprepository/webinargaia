import React from 'react';
import { MinioSettings } from '../../../types/settings';

interface MinioSettingsFormProps {
  settings: MinioSettings;
  onChange: (field: keyof MinioSettings, value: string | boolean | number) => void;
  disabled?: boolean;
}

const MinioSettingsForm: React.FC<MinioSettingsFormProps> = ({
  settings,
  onChange,
  disabled = false
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          MinIO Server Endpoint
        </label>
        <input
          type="text"
          value={settings.endpoint}
          onChange={(e) => onChange('endpoint', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g., minio.example.com"
          disabled={disabled}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Server Port
        </label>
        <input
          type="number"
          value={settings.port}
          onChange={(e) => onChange('port', parseInt(e.target.value))}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="9000"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Access Key
        </label>
        <input
          type="text"
          value={settings.accessKey}
          onChange={(e) => onChange('accessKey', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={disabled}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Secret Key
        </label>
        <input
          type="password"
          value={settings.secretKey}
          onChange={(e) => onChange('secretKey', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={disabled}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bucket Name
        </label>
        <input
          type="text"
          value={settings.bucket}
          onChange={(e) => onChange('bucket', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="webinar-videos"
          disabled={disabled}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Region
        </label>
        <input
          type="text"
          value={settings.region}
          onChange={(e) => onChange('region', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g., ash-dc1"
          disabled={disabled}
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Current region: {settings.region || 'ash-dc1'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Console Endpoint
        </label>
        <input
          type="text"
          value={settings.consoleEndpoint}
          onChange={(e) => onChange('consoleEndpoint', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="console.minio.example.com"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Console Port
        </label>
        <input
          type="number"
          value={settings.consolePort}
          onChange={(e) => onChange('consolePort', parseInt(e.target.value))}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="9001"
          disabled={disabled}
        />
      </div>

      <div className="md:col-span-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.useSSL}
            onChange={(e) => onChange('useSSL', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            disabled={disabled}
          />
          <span className="text-sm text-gray-700">Use SSL/TLS</span>
        </label>
      </div>
    </div>
  );
};

export default MinioSettingsForm;