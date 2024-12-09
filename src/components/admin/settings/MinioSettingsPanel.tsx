import React, { useState, useEffect } from 'react';
import { Database, Save, TestTube, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { useSettings } from '../../../context/SettingsContext';
import { MinioSettings } from '../../../types/settings';
import { storageService } from '../../../services/storage/StorageService';
import MinioConnectionStatus from './MinioConnectionStatus';
import MinioSettingsForm from './MinioSettingsForm';

const MinioSettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [isTesting, setIsTesting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [minioSettings, setMinioSettings] = useState<MinioSettings>(settings.minioSettings);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      await storageService.testConnection(settings.minioSettings);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const handleInputChange = (field: keyof MinioSettings, value: string | boolean | number) => {
    setMinioSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      await storageService.testConnection(minioSettings);
      setTestResult({
        success: true,
        message: 'Connection successful! MinIO server is accessible.'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Connection test failed'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateSettings({ minioSettings });
      setTestResult({
        success: true,
        message: 'Settings saved successfully!'
      });
      setIsConnected(true);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to save settings'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openMinioConsole = () => {
    const protocol = minioSettings.useSSL ? 'https' : 'http';
    const url = `${protocol}://${minioSettings.consoleEndpoint}:${minioSettings.consolePort}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Database size={24} />
          MinIO Storage Configuration
        </h2>
        <button
          onClick={openMinioConsole}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <ExternalLink size={20} />
          Open MinIO Console
        </button>
      </div>

      <MinioConnectionStatus
        settings={minioSettings}
        isConnected={isConnected}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <MinioSettingsForm
          settings={minioSettings}
          onChange={handleInputChange}
          disabled={isSaving || isTesting}
        />

        {testResult && (
          <div className={`p-4 rounded-lg ${
            testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <div className="flex items-start gap-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <p>{testResult.message}</p>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={testConnection}
            disabled={isTesting || isSaving}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              isTesting
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <TestTube size={20} />
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>

          <button
            type="submit"
            disabled={isTesting || isSaving}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              isSaving
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MinioSettingsPanel;