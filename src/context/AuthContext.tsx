import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserState } from '../types/user';

const AuthContext = createContext<UserState | undefined>(undefined);

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
    autoRenew: true,
    trialEnds: null,
    enabledFunctionalities: ['create_webinar', 'manage_chat', 'manage_cta', 'customize_theme', 'view_analytics', 'manage_users', 'manage_plans', 'access_api']
  }
}];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }, [currentUser, isAuthenticated]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return false;
    }

    if (user.subscription?.status === 'blocked') {
      return false;
    }

    setCurrentUser(user);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.setItem('isAuthenticated', 'false');
  };

  const addUser = async (userData: Omit<User, 'id' | 'role' | 'webinars' | 'createdAt'>) => {
    const userExists = users.some(u => u.email === userData.email);
    if (userExists) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      role: 'collaborator',
      webinars: [],
      createdAt: new Date(),
      subscription: {
        id: Math.random().toString(36).substr(2, 9),
        userId: Math.random().toString(36).substr(2, 9),
        planId: userData.selectedPlanId || 'basic',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        autoRenew: true,
        trialEnds: null,
        enabledFunctionalities: []
      }
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

  const removeUser = (id: string) => {
    if (id === currentUser?.id) {
      return false;
    }
    setUsers(prev => prev.filter(user => user.id !== id));
    return true;
  };

  const blockUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && user.subscription) {
      updateUser(userId, {
        subscription: {
          ...user.subscription,
          status: 'blocked'
        }
      });

      if (currentUser?.id === userId) {
        logout();
      }
    }
  };

  const unblockUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && user.subscription) {
      updateUser(userId, {
        subscription: {
          ...user.subscription,
          status: 'active'
        }
      });
    }
  };

  const updateUserFunctionalities = (userId: string, functionalities: string[]) => {
    const user = users.find(u => u.id === userId);
    if (user && user.subscription) {
      updateUser(userId, {
        subscription: {
          ...user.subscription,
          enabledFunctionalities: functionalities
        }
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      users, 
      isAuthenticated, 
      login, 
      logout, 
      addUser,
      updateUser,
      removeUser,
      blockUser,
      unblockUser,
      updateUserFunctionalities
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