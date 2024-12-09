import React from 'react';
import { Activity, Database, HardDrive } from 'lucide-react';
import { MinioSettings } from '../../../types/settings';

interface MinioConnectionStatusProps {
  settings: MinioSettings;
  isConnected: boolean;
  storageUsage?: {
    used: number;
    total: number;
  };
}

const MinioConnectionStatus: React.FC<MinioConnectionStatusProps> = ({
  settings,
  isConnected,
  storageUsage
}) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
            <Database className={`w-5 h-5 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Connection Status</p>
            <p className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Endpoint</p>
            <p className="text-sm text-gray-600">{settings.endpoint}</p>
          </div>
        </div>

        {storageUsage && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <HardDrive className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Storage Usage</p>
              <p className="text-sm text-gray-600">
                {formatBytes(storageUsage.used)} / {formatBytes(storageUsage.total)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinioConnectionStatus;