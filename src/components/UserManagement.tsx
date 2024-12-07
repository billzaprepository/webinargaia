import React, { useState } from 'react';
import { UserPlus, Trash2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types/auth';

const UserManagement: React.FC = () => {
  const { users, addUser, removeUser, currentUser } = useAuth();
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'collaborator' as const
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.email || !newUser.password || !newUser.name) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (users.some(user => user.email === newUser.email)) {
      setError('Este email já está cadastrado');
      return;
    }

    addUser(newUser);
    setNewUser({
      email: '',
      password: '',
      name: '',
      role: 'collaborator'
    });
    setError('');
  };

  const handleRemoveUser = (user: User) => {
    if (user.id === currentUser?.id) {
      setError('Você não pode remover seu próprio usuário');
      return;
    }
    removeUser(user.id);
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
              Nome
            </label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Função
            </label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'admin' | 'collaborator' }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="collaborator">Colaborador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus size={20} />
          Adicionar Usuário
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Usuários Cadastrados</h3>
        <div className="divide-y">
          {users.map(user => (
            <div key={user.id} className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {user.role === 'admin' ? 'Administrador' : 'Colaborador'}
                </span>
              </div>
              <button
                onClick={() => handleRemoveUser(user)}
                className="text-red-500 hover:text-red-700 p-2"
                disabled={user.id === currentUser?.id}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;