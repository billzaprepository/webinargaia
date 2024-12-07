import React, { createContext, useContext, useState } from 'react';
import { Webinar, WebinarState, WebinarTheme } from '../types/webinar';
import { useAuth } from './AuthContext';

const WebinarContext = createContext<WebinarState | undefined>(undefined);

const defaultTheme: WebinarTheme = {
  primaryColor: '#3B82F6',
  backgroundColor: '#F3F4F6',
  headerColor: '#1F2937',
  chatBackgroundColor: '#FFFFFF',
  chatTextColor: '#374151',
  fontFamily: 'Inter, sans-serif'
};

export const WebinarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [currentWebinar, setCurrentWebinar] = useState<Webinar | null>(null);
  const { currentUser } = useAuth();

  const getUserWebinars = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return webinars;
    return webinars.filter(webinar => webinar.createdBy === currentUser.id);
  };

  const addWebinar = (newWebinar: Omit<Webinar, 'id'>) => {
    if (!currentUser) return null;
    
    const webinar: Webinar = {
      ...newWebinar,
      id: Math.random().toString(36).substr(2, 9),
      createdBy: currentUser.id,
      ctaButtons: [],
      theme: defaultTheme,
      messages: []
    };
    
    setWebinars(prev => [...prev, webinar]);
    return webinar;
  };

  const updateWebinar = (id: string, updates: Partial<Webinar>) => {
    if (!currentUser) return;
    
    setWebinars(prev => prev.map(webinar => {
      // Only allow update if user is admin or the creator
      if (webinar.id === id && (currentUser.role === 'admin' || webinar.createdBy === currentUser.id)) {
        return { ...webinar, ...updates };
      }
      return webinar;
    }));
  };

  const removeWebinar = (id: string) => {
    if (!currentUser) return;
    
    setWebinars(prev => prev.filter(webinar => {
      // Only allow removal if user is admin or the creator
      if (webinar.id === id) {
        return !(currentUser.role === 'admin' || webinar.createdBy === currentUser.id);
      }
      return true;
    }));
  };

  const canManageWebinar = (webinarId: string) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    
    const webinar = webinars.find(w => w.id === webinarId);
    return webinar?.createdBy === currentUser.id;
  };

  return (
    <WebinarContext.Provider value={{
      webinars: getUserWebinars(),
      currentWebinar,
      addWebinar,
      updateWebinar,
      removeWebinar,
      setCurrentWebinar,
      canManageWebinar
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