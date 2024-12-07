export interface UserFunctionality {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
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
  functionalities: string[];
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
  role: 'admin' | 'customer' | 'guest';
  company?: string;
  phone?: string;
  subscription?: Subscription;
  webinars: Webinar[];
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'role' | 'webinars' | 'createdAt'>) => Promise<boolean>;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  subscribeToPlan: (userId: string, planId: string) => Promise<boolean>;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
}