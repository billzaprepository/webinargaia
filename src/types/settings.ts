import { Plan } from './user';

export interface MinioSettings {
  endpoint: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  useSSL: boolean;
  port?: number;
  region?: string;
  consoleEndpoint?: string;
  consolePort?: number;
}

export interface LoginSettings {
  logo?: File | null;
  logoUrl?: string;
  title?: string;
}

export interface Settings {
  logo?: File | null;
  plans: Plan[];
  loginSettings?: LoginSettings;
  minioSettings: MinioSettings;
}

export interface SettingsState {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}