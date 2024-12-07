import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { User } from '../types/user';

interface SubscriptionStatusProps {
  user: User;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ user }) => {
  if (!user.subscription) {
    return null;
  }

  const now = new Date();
  const endDate = new Date(user.subscription.endDate);
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isTrial = user.subscription.status === 'trial';

  const getStatusColor = () => {
    if (user.subscription.status === 'blocked') return 'bg-red-100 text-red-800';
    if (user.subscription.status === 'expired') return 'bg-gray-100 text-gray-800';
    if (daysLeft <= 3) return 'bg-red-100 text-red-800';
    if (daysLeft <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-500" />
          <div>
            <h3 className="font-medium text-gray-900">Status da Assinatura</h3>
            <p className="text-sm text-gray-500">
              {isTrial ? 'Período de teste' : 'Plano ' + user.subscription.planId}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {user.subscription.status === 'blocked' ? (
            'Bloqueado'
          ) : user.subscription.status === 'expired' ? (
            'Expirado'
          ) : daysLeft <= 0 ? (
            'Expirado'
          ) : (
            `${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'} restantes`
          )}
        </div>
      </div>

      {(daysLeft <= 7 && user.subscription.status === 'active') && (
        <div className="mt-4 flex items-start gap-2 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>
            Sua assinatura está próxima do vencimento. Para continuar usando todos os recursos, 
            por favor renove sua assinatura.
          </p>
        </div>
      )}

      {user.subscription.status === 'blocked' && (
        <div className="mt-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-md">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>
            Sua conta está bloqueada. Entre em contato com o suporte para mais informações.
          </p>
        </div>
      )}

      {user.subscription.status === 'trial' && (
        <div className="mt-4 flex items-start gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-md">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>
            Você está no período de teste. Aproveite todos os recursos gratuitamente por {daysLeft} dias.
            Para continuar usando após esse período, escolha um plano.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;