export interface PlanLimits {
  maxWebinars: number;
  maxStorage: number;
  maxViewers: number;
  canManageChat: boolean;
  canManageCTA: boolean;
  canCustomizeTheme: boolean;
  canUseTimer: boolean;
  canViewAnalytics: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  maxWebinars: number;
  maxViewers: number;
  storageLimit: number;
  customization: boolean;
  analytics: boolean;
  duration?: number;
  functionalities?: string[];
  limits?: PlanLimits;
  trialDays?: number;
  trialMessage?: string;
}

export interface UserFunctionality {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired' | 'blocked' | 'trial';
  autoRenew: boolean;
  trialEnds: Date | null;
  enabledFunctionalities: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'collaborator';
  company?: string;
  phone?: string;
  subscription?: Subscription;
  webinars: any[];
  createdAt: Date;
  lastLogin?: Date;
  selectedPlanId?: string;
}

export interface UserState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'role' | 'webinars' | 'createdAt'>) => Promise<boolean>;
  updateUser: (id: string, data: Partial<User>) => void;
  removeUser: (id: string) => boolean;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  updateUserFunctionalities: (userId: string, functionalities: string[]) => void;
}