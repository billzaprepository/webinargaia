import React, { createContext, useContext, useState } from 'react';
import { Webinar, WebinarState, WebinarTheme } from '../types/webinar';
import { useAuth } from './AuthContext';

const defaultTheme: WebinarTheme = {
  primaryColor: '#3B82F6',
  backgroundColor: '#F3F4F6',
  headerColor: '#1F2937',
  chatBackgroundColor: '#FFFFFF',
  chatTextColor: '#374151',
  fontFamily: 'Inter, sans-serif'
};

const WebinarContext = createContext<WebinarState | undefined>(undefined);

export const WebinarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [currentWebinar, setCurrentWebinar] = useState<Webinar | null>(null);
  const { currentUser } = useAuth();

  // Filter webinars based on user role and ownership
  const getAccessibleWebinars = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return webinars;
    return webinars.filter(webinar => webinar.createdBy === currentUser.id);
  };

  const addWebinar = (newWebinar: Omit<Webinar, 'id'>) => {
    if (!currentUser) return null;

    // Check if user has permission to create webinars
    const canCreateWebinar = currentUser.role === 'admin' || 
      (currentUser.subscription?.enabledFunctionalities?.includes('create_webinar'));

    if (!canCreateWebinar) return null;

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

    // Find the webinar
    const webinar = webinars.find(w => w.id === id);
    if (!webinar) return;

    // Check if user has permission to update this webinar
    const canUpdate = currentUser.role === 'admin' || webinar.createdBy === currentUser.id;
    if (!canUpdate) return;

    setWebinars(prev => prev.map(webinar => 
      webinar.id === id ? { ...webinar, ...updates } : webinar
    ));
  };

  const removeWebinar = (id: string) => {
    if (!currentUser) return;

    // Find the webinar
    const webinar = webinars.find(w => w.id === id);
    if (!webinar) return;

    // Check if user has permission to delete this webinar
    const canDelete = currentUser.role === 'admin' || webinar.createdBy === currentUser.id;
    if (!canDelete) return;

    setWebinars(prev => prev.filter(webinar => webinar.id !== id));
  };

  return (
    <WebinarContext.Provider value={{
      webinars: getAccessibleWebinars(),
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