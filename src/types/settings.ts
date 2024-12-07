import { Plan } from './user';

export interface Settings {
  logo?: File | null;
  plans: Plan[];
}

export interface SettingsState {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}