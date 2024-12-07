import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlanCard from '../components/PlanCard';
import { Plan } from '../types/user';

const plans: Plan[] = [
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
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 199.90,
    description: 'Para grandes empresas',
    features: [
      'Webinars ilimitados',
      'Até 2000 espectadores',
      '200GB de armazenamento',
      'Chat ao vivo',
      'Personalização total',
      'Análises avançadas',
      'API disponível',
      'Suporte 24/7',
      'Treinamento dedicado'
    ],
    maxWebinars: -1, // unlimited
    maxViewers: 2000,
    storageLimit: 200,
    customization: true,
    analytics: true
  }
];

const PlansPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (plan: Plan) => {
    navigate(`/admin/checkout/${plan.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o Plano Ideal para Você
          </h1>
          <p className="text-xl text-gray-600">
            Comece a criar webinars profissionais hoje mesmo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isPopular={index === 1}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Perguntas Frequentes
          </h2>
          <div className="max-w-3xl mx-auto grid gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Posso trocar de plano depois?
              </h3>
              <p className="text-gray-600">
                Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
                As alterações serão aplicadas no próximo ciclo de cobrança.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Como funciona o período de teste?
              </h3>
              <p className="text-gray-600">
                Oferecemos 7 dias de teste grátis em qualquer plano.
                Você só será cobrado após esse período se decidir continuar.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Preciso fornecer dados de cartão de crédito?
              </h3>
              <p className="text-gray-600">
                Sim, mas você não será cobrado durante o período de teste.
                Você pode cancelar a qualquer momento antes do fim do teste.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansPage;