import React, { useState } from 'react';
import { DollarSign, Plus, Trash2, Save, Package, Clock, Edit2, X } from 'lucide-react';
import { Plan } from '../types/user';
import { useSettings } from '../context/SettingsContext';

const PlansManagement: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [plans, setPlans] = useState<Plan[]>(settings.plans);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddPlan = () => {
    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      name: 'Novo Plano',
      price: 0,
      description: 'Descrição do plano',
      features: ['Webinars por mês'],
      maxWebinars: 1,
      maxViewers: 100,
      storageLimit: 1,
      customization: false,
      analytics: false,
      duration: 30,
      functionalities: [],
      trialDays: 7,
      trialMessage: '7 dias de teste grátis incluídos',
      limits: {
        maxWebinars: 5,
        maxStorage: 10,
        maxViewers: 100,
        canManageChat: false,
        canManageCTA: false,
        canCustomizeTheme: false,
        canUseTimer: false,
        canViewAnalytics: false
      }
    };
    setPlans([...plans, newPlan]);
  };

  const handleUpdatePlan = (index: number, field: keyof Plan, value: any) => {
    const updatedPlans = [...plans];
    updatedPlans[index] = {
      ...updatedPlans[index],
      [field]: value
    };
    setPlans(updatedPlans);
  };

  const handleUpdateLimits = (planIndex: number, field: keyof Plan['limits'], value: any) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex] = {
      ...updatedPlans[planIndex],
      limits: {
        ...updatedPlans[planIndex].limits,
        [field]: value
      }
    };
    setPlans(updatedPlans);
  };

  const handleRemovePlan = (index: number) => {
    const updatedPlans = [...plans];
    updatedPlans.splice(index, 1);
    setPlans(updatedPlans);
  };

  const handleSave = () => {
    setIsSaving(true);
    updateSettings({ plans });
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Package size={24} />
          Gerenciar Planos
        </h2>
        <button
          onClick={handleAddPlan}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Novo Plano
        </button>
      </div>

      <div className="space-y-8">
        {plans.map((plan, planIndex) => (
          <div key={plan.id} className="border rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Plano
                </label>
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => handleUpdatePlan(planIndex, 'name', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Mensal (R$)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    value={plan.price}
                    onChange={(e) => handleUpdatePlan(planIndex, 'price', parseFloat(e.target.value))}
                    className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={plan.description}
                  onChange={(e) => handleUpdatePlan(planIndex, 'description', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Limites e Permissões</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Limite de Webinars
                    </label>
                    <input
                      type="number"
                      value={plan.limits?.maxWebinars || 0}
                      onChange={(e) => handleUpdateLimits(planIndex, 'maxWebinars', parseInt(e.target.value))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Limite de Espectadores
                    </label>
                    <input
                      type="number"
                      value={plan.limits?.maxViewers || 0}
                      onChange={(e) => handleUpdateLimits(planIndex, 'maxViewers', parseInt(e.target.value))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Armazenamento (GB)
                    </label>
                    <input
                      type="number"
                      value={plan.limits?.maxStorage || 0}
                      onChange={(e) => handleUpdateLimits(planIndex, 'maxStorage', parseInt(e.target.value))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Funcionalidades
                    </label>
                    
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={plan.limits?.canManageChat || false}
                          onChange={(e) => handleUpdateLimits(planIndex, 'canManageChat', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Gerenciar Chat</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={plan.limits?.canManageCTA || false}
                          onChange={(e) => handleUpdateLimits(planIndex, 'canManageCTA', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Gerenciar CTAs</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={plan.limits?.canCustomizeTheme || false}
                          onChange={(e) => handleUpdateLimits(planIndex, 'canCustomizeTheme', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Personalizar Tema</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={plan.limits?.canUseTimer || false}
                          onChange={(e) => handleUpdateLimits(planIndex, 'canUseTimer', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Usar Cronômetro</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={plan.limits?.canViewAnalytics || false}
                          onChange={(e) => handleUpdateLimits(planIndex, 'canViewAnalytics', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Visualizar Análises</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  Período de Teste
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dias de Teste
                    </label>
                    <input
                      type="number"
                      value={plan.trialDays || 7}
                      onChange={(e) => handleUpdatePlan(planIndex, 'trialDays', parseInt(e.target.value))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem de Teste
                    </label>
                    <input
                      type="text"
                      value={plan.trialMessage || `${plan.trialDays} dias de teste grátis incluídos`}
                      onChange={(e) => handleUpdatePlan(planIndex, 'trialMessage', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Ex: 7 dias de teste grátis incluídos"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Esta mensagem será exibida na página de planos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => handleRemovePlan(planIndex)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
              >
                <Trash2 size={20} />
                Remover Plano
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
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
  );
};

export default PlansManagement;