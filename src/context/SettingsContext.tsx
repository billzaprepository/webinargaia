import React, { createContext, useContext, useState } from 'react';
import { Settings, SettingsState } from '../types/settings';
import { Plan } from '../types/user';

const defaultPlans: Plan[] = [
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

const SettingsContext = createContext<SettingsState | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    logo: null,
    plans: defaultPlans
  });

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};