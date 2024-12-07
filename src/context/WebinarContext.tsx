import React, { createContext, useContext, useState } from 'react';
import { Webinar, WebinarState, WebinarTheme } from '../types/webinar';

const defaultTheme: WebinarTheme = {
  primaryColor: '#3B82F6',
  backgroundColor: '#F3F4F6',
  headerColor: '#1F2937',
  chatBackgroundColor: '#FFFFFF',
  chatTextColor: '#374151',
  fontFamily: 'Inter, sans-serif'
};

// Default webinar data
const defaultWebinar: Webinar = {
  id: '1',
  slug: 'estrategias-investimento-2024',
  title: 'Estratégias de Investimento 2024',
  description: 'Descubra as melhores estratégias de investimento para 2024 com nossos especialistas. Aprenda sobre diversificação de carteira, análise de mercado e as tendências que irão moldar o cenário financeiro.',
  thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1600&h=900',
  schedule: {
    startTime: new Date(Date.now() + 3600000), // 1 hour from now
    endTime: new Date(Date.now() + 7200000), // 2 hours from now
    title: 'Estratégias de Investimento 2024',
    description: 'Webinar ao vivo com especialistas do mercado financeiro',
    status: 'scheduled'
  },
  messages: [
    {
      id: '1',
      username: 'João Silva',
      message: 'Olá a todos! Bem-vindos ao nosso webinar sobre investimentos!',
      timestamp: '14:00',
      scheduledTime: 0
    },
    {
      id: '2',
      username: 'Maria Oliveira',
      message: 'Muito interessante essa análise sobre o mercado de ações!',
      timestamp: '14:05',
      scheduledTime: 300
    },
    {
      id: '3',
      username: 'Pedro Santos',
      message: 'Qual é a sua opinião sobre investimentos em criptomoedas para 2024?',
      timestamp: '14:10',
      scheduledTime: 600
    }
  ],
  video: null,
  createdBy: '1',
  isActive: true,
  ctaButtons: [
    {
      id: '1',
      text: 'Baixar E-book Gratuito',
      url: 'https://exemplo.com/ebook',
      color: '#22C55E',
      showAt: 300,
      duration: 300
    },
    {
      id: '2',
      text: 'Inscreva-se no Curso',
      url: 'https://exemplo.com/curso',
      color: '#3B82F6',
      showAt: 900,
      duration: 300
    }
  ],
  theme: defaultTheme
};

const WebinarContext = createContext<WebinarState | undefined>(undefined);

export const WebinarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [webinars, setWebinars] = useState<Webinar[]>([defaultWebinar]);
  const [currentWebinar, setCurrentWebinar] = useState<Webinar | null>(defaultWebinar);

  const addWebinar = (newWebinar: Omit<Webinar, 'id'>) => {
    const webinar: Webinar = {
      ...newWebinar,
      id: Math.random().toString(36).substr(2, 9),
      ctaButtons: [],
      theme: defaultTheme,
      messages: []
    };
    setWebinars(prev => [...prev, webinar]);
    return webinar;
  };

  const updateWebinar = (id: string, updates: Partial<Webinar>) => {
    setWebinars(prev => prev.map(webinar => 
      webinar.id === id ? { ...webinar, ...updates } : webinar
    ));
  };

  const removeWebinar = (id: string) => {
    setWebinars(prev => prev.filter(webinar => webinar.id !== id));
  };

  return (
    <WebinarContext.Provider value={{
      webinars,
      currentWebinar,
      addWebinar,
      updateWebinar,
      removeWebinar,
      setCurrentWebinar
    }}>
      {children}
    </WebinarContext.Provider>
  );
};

export const useWebinar = () => {
  const context = useContext(WebinarContext);
  if (context === undefined) {
    throw new Error('useWebinar must be used within a WebinarProvider');
  }
  return context;
};