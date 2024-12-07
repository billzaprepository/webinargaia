import { UserFunctionality } from '../types/user';

export const DEFAULT_FUNCTIONALITIES: UserFunctionality[] = [
  {
    id: 'create_webinar',
    name: 'Criar Webinars',
    description: 'Permite criar e gerenciar webinars',
    enabled: false
  },
  {
    id: 'manage_chat',
    name: 'Gerenciar Chat',
    description: 'Permite configurar mensagens programadas no chat',
    enabled: false
  },
  {
    id: 'manage_cta',
    name: 'Gerenciar CTAs',
    description: 'Permite adicionar e configurar botões de CTA',
    enabled: false
  },
  {
    id: 'customize_theme',
    name: 'Personalizar Tema',
    description: 'Permite personalizar cores e aparência do webinar',
    enabled: false
  },
  {
    id: 'view_analytics',
    name: 'Visualizar Análises',
    description: 'Permite acessar estatísticas e relatórios',
    enabled: false
  },
  {
    id: 'manage_users',
    name: 'Gerenciar Usuários',
    description: 'Permite adicionar e gerenciar usuários',
    enabled: false
  },
  {
    id: 'manage_plans',
    name: 'Gerenciar Planos',
    description: 'Permite criar e configurar planos de assinatura',
    enabled: false
  },
  {
    id: 'access_api',
    name: 'Acesso à API',
    description: 'Permite integração via API',
    enabled: false
  }
];

export const getFunctionalityById = (id: string): UserFunctionality | undefined => {
  return DEFAULT_FUNCTIONALITIES.find(f => f.id === id);
};

export const getEnabledFunctionalities = (enabledIds: string[]): UserFunctionality[] => {
  return DEFAULT_FUNCTIONALITIES.filter(f => enabledIds.includes(f.id));
};