import React, { useState } from 'react';
import { DollarSign, Plus, Trash2, Save, Package, Clock, Edit2 } from 'lucide-react';
import { Plan } from '../types/user';
import { useSettings } from '../context/SettingsContext';
import FunctionalityManager from './FunctionalityManager';

const DEFAULT_FEATURES = [
  'Webinars por mês',
  'Limite de espectadores',
  'Armazenamento',
  'Chat ao vivo',
  'Relatórios básicos',
  'Personalização avançada',
  'Análises detalhadas',
  'Suporte prioritário',
  'API disponível',
  'Treinamento dedicado'
];

const PlansManagement: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [plans, setPlans] = useState<Plan[]>(settings.plans);
  const [isSaving, setIsSaving] = useState(false);
  const [editingFeature, setEditingFeature] = useState<{planIndex: number, featureIndex: number} | null>(null);

  const handleAddPlan = () => {
    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      name: 'Novo Plano',
      price: 0,
      description: 'Descrição do plano',
      features: ['Webinars por mês', 'Limite de espectadores', 'Armazenamento'],
      maxWebinars: 1,
      maxViewers: 100,
      storageLimit: 1,
      customization: false,
      analytics: false,
      duration: 30,
      functionalities: []
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

  const handleUpdateFunctionalities = (planIndex: number, functionalities: string[]) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex] = {
      ...updatedPlans[planIndex],
      functionalities
    };
    setPlans(updatedPlans);
  };

  const handleAddFeature = (planIndex: number) => {
    setEditingFeature({ planIndex, featureIndex: plans[planIndex].features.length });
  };

  const handleUpdateFeature = (planIndex: number, featureIndex: number, value: string) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].features[featureIndex] = value;
    setPlans(updatedPlans);
    setEditingFeature(null);
  };

  const handleRemoveFeature = (planIndex: number, featureIndex: number) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].features.splice(featureIndex, 1);
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

      <div className="space-y-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Limite de Webinars
                </label>
                <input
                  type="number"
                  value={plan.maxWebinars}
                  onChange={(e) => handleUpdatePlan(planIndex, 'maxWebinars', parseInt(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Limite de Espectadores
                </label>
                <input
                  type="number"
                  value={plan.maxViewers}
                  onChange={(e) => handleUpdatePlan(planIndex, 'maxViewers', parseInt(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Armazenamento (GB)
                </label>
                <input
                  type="number"
                  value={plan.storageLimit}
                  onChange={(e) => handleUpdatePlan(planIndex, 'storageLimit', parseInt(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duração da Assinatura (dias)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    value={plan.duration || 30}
                    onChange={(e) => handleUpdatePlan(planIndex, 'duration', parseInt(e.target.value))}
                    className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Após este período, o acesso será bloqueado automaticamente
                </p>
              </div>

              <div className="md:col-span-2">
                <FunctionalityManager
                  enabledFunctionalities={plan.functionalities || []}
                  onUpdate={(functionalities) => handleUpdateFunctionalities(planIndex, functionalities)}
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Funcionalidades Visíveis
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddFeature(planIndex)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Adicionar
                  </button>
                </div>

                <div className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      {editingFeature?.planIndex === planIndex && editingFeature?.featureIndex === featureIndex ? (
                        <select
                          value={feature}
                          onChange={(e) => handleUpdateFeature(planIndex, featureIndex, e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          autoFocus
                          onBlur={() => setEditingFeature(null)}
                        >
                          {DEFAULT_FEATURES.map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      ) : (
                        <>
                          <span className="flex-1">{feature}</span>
                          <button
                            type="button"
                            onClick={() => setEditingFeature({ planIndex, featureIndex })}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit2 size={16} />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(planIndex, featureIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
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