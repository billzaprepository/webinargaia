import React, { useState } from 'react';
import { Webhook, Save, AlertCircle, Plus, Trash2, RefreshCw } from 'lucide-react';

interface WebhookConfig {
  id: string;
  url: string;
  secret: string;
  enabled: boolean;
  events: {
    planExpired: boolean;
    trialExpired: boolean;
    planExpiringIn7Days: boolean;
  };
  lastTriggered?: Date;
  lastStatus?: number;
}

const WebhookSettings: React.FC = () => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const generateSecret = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const handleAddWebhook = () => {
    const newWebhook: WebhookConfig = {
      id: crypto.randomUUID(),
      url: '',
      secret: generateSecret(),
      enabled: true,
      events: {
        planExpired: true,
        trialExpired: true,
        planExpiringIn7Days: true
      }
    };
    setWebhooks([...webhooks, newWebhook]);
  };

  const handleUpdateWebhook = (id: string, updates: Partial<WebhookConfig>) => {
    setWebhooks(prev => prev.map(webhook => 
      webhook.id === id ? { ...webhook, ...updates } : webhook
    ));
  };

  const handleRemoveWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Save webhooks to backend
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': webhook.secret
        },
        body: JSON.stringify({
          event: 'test',
          timestamp: new Date().toISOString(),
          data: {
            message: 'Teste de webhook',
            user: {
              name: 'Usuário Teste',
              email: 'teste@exemplo.com',
              phone: '(00) 00000-0000'
            }
          }
        })
      });

      handleUpdateWebhook(webhook.id, {
        lastTriggered: new Date(),
        lastStatus: response.status
      });

      alert(response.ok ? 'Teste enviado com sucesso!' : 'Erro ao enviar teste');
    } catch (error) {
      alert('Erro ao enviar teste: ' + error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Webhook size={24} />
        Webhooks
      </h2>

      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Eventos Disponíveis:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Vencimento do plano</li>
              <li>Vencimento do período de teste</li>
              <li>Aviso de 7 dias para vencimento</li>
            </ul>
            <p className="mt-2">
              Cada notificação incluirá nome completo e telefone do usuário.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {webhooks.map(webhook => (
            <div key={webhook.id} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL do Webhook
                  </label>
                  <input
                    type="url"
                    value={webhook.url}
                    onChange={(e) => handleUpdateWebhook(webhook.id, { url: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://sua-api.com/webhook"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chave Secreta
                  </label>
                  <input
                    type="text"
                    value={webhook.secret}
                    readOnly
                    className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={webhook.events.planExpired}
                    onChange={(e) => handleUpdateWebhook(webhook.id, {
                      events: { ...webhook.events, planExpired: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Notificar quando o plano vencer</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={webhook.events.trialExpired}
                    onChange={(e) => handleUpdateWebhook(webhook.id, {
                      events: { ...webhook.events, trialExpired: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Notificar quando o teste grátis vencer</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={webhook.events.planExpiringIn7Days}
                    onChange={(e) => handleUpdateWebhook(webhook.id, {
                      events: { ...webhook.events, planExpiringIn7Days: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Notificar 7 dias antes do vencimento</span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={webhook.enabled}
                      onChange={(e) => handleUpdateWebhook(webhook.id, { enabled: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Ativo</span>
                  </label>

                  {webhook.lastTriggered && (
                    <span className="text-sm text-gray-500">
                      Último disparo: {webhook.lastTriggered.toLocaleString()}
                      {webhook.lastStatus && (
                        <span className={webhook.lastStatus === 200 ? 'text-green-500' : 'text-red-500'}>
                          {' '}({webhook.lastStatus})
                        </span>
                      )}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestWebhook(webhook)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    <RefreshCw size={14} />
                    Testar
                  </button>
                  <button
                    onClick={() => handleRemoveWebhook(webhook.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    <Trash2 size={14} />
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddWebhook}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Plus size={20} />
          Adicionar Webhook
        </button>

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

export default WebhookSettings;