import React from 'react';
import { Check } from 'lucide-react';
import { Plan } from '../types/user';

interface PlanCardProps {
  plan: Plan;
  isPopular?: boolean;
  onSelect: (plan: Plan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isPopular, onSelect }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${isPopular ? 'ring-2 ring-blue-500' : ''}`}>
      {isPopular && (
        <div className="bg-blue-500 text-white text-center py-1.5 text-sm font-medium">
          Mais Popular
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-bold text-gray-900">R${plan.price}</span>
          <span className="text-gray-500 ml-1">/mês</span>
        </div>
        
        <ul className="mt-6 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0" />
              <span className="ml-3 text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={() => onSelect(plan)}
          className={`mt-8 w-full py-3 px-4 rounded-lg font-medium ${
            isPopular
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          } transition-colors`}
        >
          Selecionar Plano
        </button>
      </div>
    </div>
  );
};

export default PlanCard;