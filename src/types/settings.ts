import { Plan } from './user';

export interface LoginSettings {
  logo?: File | null;
  logoUrl?: string;
  title?: string;
}

export interface Settings {
  logo?: File | null;
  plans: Plan[];
  loginSettings?: LoginSettings;
}

export interface SettingsState {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}