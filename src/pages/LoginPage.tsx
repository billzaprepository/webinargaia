import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Building2, Phone, Package, AlertCircle, ExternalLink, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Plan } from '../types/user';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();
  const { login, addUser, isAuthenticated, users } = useAuth();
  const { settings } = useSettings();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const selectedPlan = settings.plans.find(plan => plan.id === selectedPlanId);

  const BlockedUserMessage = () => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
        <div>
          <p className="text-sm text-red-700">Seu acesso está bloqueado. Entre em contato com o suporte.</p>
          <div className="mt-2 space-y-2">
            <p className="text-sm text-red-600">
              Email: suporte@bizsmart.com.br<br />
              Telefone: (62) 9 8146-5854
            </p>
            <a
              href="https://bizsmart.com.br/suporte-webinar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 bg-red-100 px-3 py-1.5 rounded-md"
            >
              <ExternalLink size={16} />
              Chamar Suporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsBlocked(false);

    if (isLogin) {
      const loginSuccess = await login(email, password);
      if (!loginSuccess) {
        const user = users.find(u => u.email === email);
        if (user?.subscription?.status === 'blocked') {
          setIsBlocked(true);
        } else {
          setError('Email ou senha incorretos');
        }
      } else {
        navigate('/admin');
      }
    } else {
      if (!name || !email || !password || !company || !phone || !selectedPlanId) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }

      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }

      const registrationSuccess = await addUser({
        name,
        email,
        password,
        company,
        phone,
        selectedPlanId
      });

      if (registrationSuccess) {
        setSuccess(true);
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setCompany('');
        setPhone('');
        setSelectedPlanId('');
        // Switch to login form after 2 seconds
        setTimeout(() => {
          setIsLogin(true);
          setSuccess(false);
        }, 2000);
      } else {
        setError('Este email já está cadastrado');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            {isLogin ? 'Acesso Administrativo' : 'Criar Conta'}
          </h2>

          {success && (
            <div className="bg-green-50 text-green-500 p-3 rounded-md text-sm text-center mb-6">
              Conta criada com sucesso! Redirecionando para o login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isBlocked ? (
              <BlockedUserMessage />
            ) : error ? (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                {error}
              </div>
            ) : null}

            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite seu nome"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite seu email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome da empresa"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-1">
                    Plano *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      id="plan"
                      value={selectedPlanId}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione um plano</option>
                      {settings.plans.map((plan: Plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - R$ {plan.price}/mês
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPlan && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        {selectedPlan.name} - Funcionalidades Incluídas:
                      </h3>
                      <ul className="space-y-2">
                        {selectedPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 text-xs text-gray-500">
                        * 7 dias de teste grátis incluídos
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess(false);
                setIsBlocked(false);
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Entre'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;