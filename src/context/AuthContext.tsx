import React, { createContext, useContext, useState } from 'react';
import { User, Plan, UserState } from '../types/user';

const AuthContext = createContext<UserState | undefined>(undefined);

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
  }
];

// Initial admin user
const initialUsers: User[] = [{
  id: '1',
  name: 'Administrador',
  email: 'admin@admin.com',
  password: '123456',
  role: 'admin',
  webinars: [],
  createdAt: new Date(),
  subscription: {
    id: '1',
    userId: '1',
    planId: 'basic',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    autoRenew: true
  }
}];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData: Omit<User, 'id' | 'role' | 'webinars' | 'createdAt'>) => {
    const userExists = users.some(u => u.email === userData.email);
    if (userExists) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      role: 'customer',
      webinars: [],
      createdAt: new Date()
    };

    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...data } : user
    ));

    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    if (currentUser?.id === id) {
      logout();
    }
  };

  const subscribeToPlan = async (userId: string, planId: string) => {
    const user = users.find(u => u.id === userId);
    const plan = plans.find(p => p.id === planId);

    if (!user || !plan) {
      return false;
    }

    const subscription = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      planId,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active' as const,
      autoRenew: true
    };

    updateUser(userId, { subscription });
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      users, 
      isAuthenticated, 
      login, 
      logout, 
      register,
      updateUser,
      deleteUser,
      subscribeToPlan
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};