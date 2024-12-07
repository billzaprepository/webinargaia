import React, { useState } from 'react';
import { UserPlus, Trash2, Shield, Edit2, X, Save, Package, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { User } from '../types/user';

const UserManagement: React.FC = () => {
  const { users, addUser, removeUser, updateUser, currentUser, blockUser, unblockUser } = useAuth();
  const { settings } = useSettings();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: '',
    phone: '',
    role: 'collaborator' as const,
    selectedPlanId: '',
    status: 'active' as 'active' | 'inactive' | 'blocked' | 'financial_pending'
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.name || !formData.company || !formData.phone) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (!editingId && !formData.password) {
      setError('A senha é obrigatória para novos usuários');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!editingId && !formData.selectedPlanId) {
      setError('Selecione um plano');
      return;
    }

    if (editingId) {
      // Update existing user
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      updateUser(editingId, updateData);
      
      // Handle status changes
      if (formData.status === 'blocked') {
        blockUser(editingId);
      } else if (formData.status === 'active') {
        unblockUser(editingId);
      }
      
      resetForm();
    } else {
      // Add new user
      if (users.some(user => user.email === formData.email)) {
        setError('Este email já está cadastrado');
        return;
      }
      addUser(formData);
      resetForm();
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({
      email: user.email,
      password: '',
      name: user.name,
      company: user.company || '',
      phone: user.phone || '',
      role: user.role === 'admin' ? 'admin' : 'collaborator',
      selectedPlanId: user.subscription?.planId || '',
      status: user.subscription?.status === 'blocked' ? 'blocked' : 
              user.subscription?.status === 'trial' ? 'trial' :
              user.subscription?.status === 'expired' ? 'inactive' : 'active'
    });
  };

  const handleRemoveUser = (user: User) => {
    if (user.id === currentUser?.id) {
      setError('Você não pode remover seu próprio usuário');
      return;
    }
    removeUser(user.id);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      email: '',
      password: '',
      name: '',
      company: '',
      phone: '',
      role: 'collaborator',
      selectedPlanId: '',
      status: 'active'
    });
    setError('');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'trial':
        return 'bg-blue-100 text-blue-700';
      case 'blocked':
        return 'bg-red-100 text-red-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      case 'financial_pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'trial':
        return 'Em teste';
      case 'blocked':
        return 'Bloqueado';
      case 'inactive':
        return 'Inativo';
      case 'financial_pending':
        return 'Pendência Financeira';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Shield size={24} />
        Gerenciamento de Usuários
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Nome completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {editingId ? 'Nova Senha (opcional)' : 'Senha *'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="********"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empresa *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Nome da empresa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Função
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'collaborator' }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="collaborator">Colaborador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plano
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={formData.selectedPlanId}
                onChange={(e) => setFormData(prev => ({ ...prev, selectedPlanId: e.target.value }))}
                className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione um plano</option>
                {settings.plans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - R$ {plan.price}/mês
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="relative">
              <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as typeof formData.status }))}
                className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="blocked">Bloqueado</option>
                <option value="financial_pending">Pendência Financeira</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {editingId ? (
            <>
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Salvar Alterações
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <X size={20} />
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Adicionar Usuário
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Usuários Cadastrados</h3>
        <div className="divide-y">
          {users.map(user => (
            <div key={user.id} className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role === 'admin' ? 'Administrador' : 'Colaborador'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    getStatusBadgeColor(user.subscription?.status || 'inactive')
                  }`}>
                    {getStatusLabel(user.subscription?.status || 'inactive')}
                  </span>
                  {user.company && (
                    <span className="text-xs text-gray-500">
                      {user.company}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-blue-500 hover:text-blue-700 p-2"
                  disabled={editingId !== null}
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleRemoveUser(user)}
                  className="text-red-500 hover:text-red-700 p-2"
                  disabled={editingId !== null || user.id === currentUser?.id}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;