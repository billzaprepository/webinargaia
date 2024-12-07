export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'collaborator';
}

export interface AuthState {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  removeUser: (id: string) => void;
}