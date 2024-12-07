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
    analytics: false,
    duration: 30
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
    autoRenew: true,
    trialEnds: null
  }
}];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkUserAccess = (user: User): boolean => {
    // Admin users always have access
    if (user.role === 'admin') return true;

    if (!user.subscription) return false;

    const now = new Date();
    const subscriptionEnd = new Date(user.subscription.endDate);
    const trialEnd = user.subscription.trialEnds ? new Date(user.subscription.trialEnds) : null;

    // First check if user is blocked
    if (user.subscription.status === 'blocked') {
      return false;
    }

    // Check if trial has ended
    if (user.subscription.status === 'trial' && trialEnd && now > trialEnd) {
      updateUser(user.id, {
        subscription: {
          ...user.subscription,
          status: 'expired'
        }
      });
      return false;
    }

    // Check if subscription has expired
    if (now > subscriptionEnd && user.subscription.status !== 'trial') {
      updateUser(user.id, {
        subscription: {
          ...user.subscription,
          status: 'expired'
        }
      });
      return false;
    }

    // Allow access for active subscriptions and valid trial periods
    return ['active', 'trial'].includes(user.subscription.status);
  };

  const login = async (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return false;

    // Check access before allowing login
    if (!checkUserAccess(user)) {
      return false;
    }

    setCurrentUser(user);
    setIsAuthenticated(true);
    updateUser(user.id, { lastLogin: new Date() });
    return true;
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

    // Create trial period (7 days)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      role: 'customer',
      webinars: [],
      createdAt: new Date(),
      subscription: {
        id: Math.random().toString(36).substr(2, 9),
        userId: Math.random().toString(36).substr(2, 9),
        planId: userData.selectedPlanId,
        startDate: new Date(),
        endDate: trialEndDate,
        status: 'trial',
        autoRenew: false,
        trialEnds: trialEndDate
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
      // If updating subscription status to blocked for current user, log them out
      if (data.subscription?.status === 'blocked') {
        logout();
      } else {
        setCurrentUser(prev => prev ? { ...prev, ...data } : null);
      }
    }
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

      // If this is the current user, log them out
      if (currentUser?.id === userId) {
        logout();
      }
    }
  };

  const unblockUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && user.subscription) {
      // Check if the subscription or trial is still valid
      const now = new Date();
      const subscriptionEnd = new Date(user.subscription.endDate);
      const trialEnd = user.subscription.trialEnds ? new Date(user.subscription.trialEnds) : null;

      let newStatus: 'active' | 'trial' | 'expired' = 'active';

      if (user.subscription.status === 'trial' && trialEnd && now <= trialEnd) {
        newStatus = 'trial';
      } else if (now > subscriptionEnd) {
        newStatus = 'expired';
      }

      updateUser(userId, {
        subscription: {
          ...user.subscription,
          status: newStatus
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
      register,
      updateUser,
      blockUser,
      unblockUser
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