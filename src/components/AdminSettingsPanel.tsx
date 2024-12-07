import React, { useState } from 'react';
import { Image, DollarSign, Settings, Upload, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Plan } from '../types/user';

const AdminSettingsPanel: React.FC = () => {
  const { updateSettings } = useAuth();
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 'basic',
      name: 'Básico',
      price: 49.90,
      description: 'Perfeito para começar',
      features: [
        'Até 5 webinars por mês',
        'Máximo de 100 espectadores',
        '10GB de armazenamento',
        'Chat ao vivo',
        'Relatórios básicos'
      ],
      maxWebinars: 5,
      maxViewers: 100,
      storageLimit: 10,
      customization: false,
      analytics: false
    },
    {
      id: 'pro',
      name: 'Profissional',
      price: 99.90,
      description: 'Para profissionais e pequenas empresas',
      features: [
        'Até 20 webinars por mês',
        'Máximo de 500 espectadores',
        '50GB de armazenamento',
        'Chat ao vivo',
        'Personalização avançada',
        'Análises detalhadas',
        'Suporte prioritário'
      ],
      maxWebinars: 20,
      maxViewers: 500,
      storageLimit: 50,
      customization: true,
      analytics: true
    }
  ]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handlePlanChange = (index: number, field: keyof Plan, value: any) => {
    const updatedPlans = [...plans];
    updatedPlans[index] = {
      ...updatedPlans[index],
      [field]: value
    };
    setPlans(updatedPlans);
  };

  const handleFeatureChange = (planIndex: number, featureIndex: number, value: string) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].features[featureIndex] = value;
    setPlans(updatedPlans);
  };

  const handleAddFeature = (planIndex: number) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].features.push('Nova funcionalidade');
    setPlans(updatedPlans);
  };

  const handleRemoveFeature = (planIndex: number, featureIndex: number) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].features.splice(featureIndex, 1);
    setPlans(updatedPlans);
  };

  const handleAddPlan = () => {
    setPlans([...plans, {
      id: `plan-${plans.length + 1}`,
      name: 'Novo Plano',
      price: 0,
      description: 'Descrição do plano',
      features: ['Funcionalidade 1'],
      maxWebinars: 1,
      maxViewers: 100,
      storageLimit: 1,
      customization: false,
      analytics: false
    }]);
  };

  const handleRemovePlan = (index: number) => {
    const updatedPlans = [...plans];
    updatedPlans.splice(index, 1);
    setPlans(updatedPlans);
  };

  const handleSave = () => {
    updateSettings({
      logo,
      plans
    });
  };

  return (
    <div className="space-y-8">
      {/* Logo Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <Image size={24} />
          Logo da Plataforma
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo preview"
                className="h-16 w-auto object-contain"
              />
            )}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload do Logo
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  <Upload size={20} />
                  Selecionar Arquivo
                </label>
                {logo && (
                  <span className="text-sm text-gray-600">
                    {logo.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign size={24} />
            Planos de Assinatura
          </h2>
          <button
            onClick={handleAddPlan}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Adicionar Plano
          </button>
        </div>

        <div className="space-y-8">
          {plans.map((plan, planIndex) => (
            <div key={plan.id} className="border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Plano
                  </label>
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) => handlePlanChange(planIndex, 'name', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Mensal (R$)
                  </label>
                  <input
                    type="number"
                    value={plan.price}
                    onChange={(e) => handlePlanChange(planIndex, 'price', parseFloat(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={plan.description}
                    onChange={(e) => handlePlanChange(planIndex, 'description', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Limite de Webinars
                  </label>
                  <input
                    type="number"
                    value={plan.maxWebinars}
                    onChange={(e) => handlePlanChange(planIndex, 'maxWebinars', parseInt(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Limite de Espectadores
                  </label>
                  <input
                    type="number"
                    value={plan.maxViewers}
                    onChange={(e) => handlePlanChange(planIndex, 'maxViewers', parseInt(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Armazenamento (GB)
                  </label>
                  <input
                    type="number"
                    value={plan.storageLimit}
                    onChange={(e) => handlePlanChange(planIndex, 'storageLimit', parseInt(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={plan.customization}
                      onChange={(e) => handlePlanChange(planIndex, 'customization', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Personalização</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={plan.analytics}
                      onChange={(e) => handlePlanChange(planIndex, 'analytics', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Análises</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-800">Funcionalidades</h3>
                  <button
                    type="button"
                    onClick={() => handleAddFeature(planIndex)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Adicionar Funcionalidade
                  </button>
                </div>

                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(planIndex, featureIndex, e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(planIndex, featureIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleRemovePlan(planIndex)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Remover Plano
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Save size={20} />
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPanel;