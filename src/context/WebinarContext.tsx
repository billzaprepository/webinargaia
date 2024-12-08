import React, { createContext, useContext, useState } from 'react';
import { Webinar, WebinarState, WebinarTheme, WebinarAnalytics } from '../types/webinar';
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

const defaultAnalytics: WebinarAnalytics = {
  totalViews: 0,
  uniqueViewers: 0,
  averageWatchTime: 0,
  engagementRate: 0,
  peakViewers: 0,
  viewerHistory: [],
  chatMessages: 0,
  ctaClicks: []
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
      messages: [],
      analytics: defaultAnalytics
    };
    
    setWebinars(prev => [...prev, webinar]);
    return webinar;
  };

  const updateWebinar = (id: string, updates: Partial<Webinar>) => {
    if (!currentUser) return;
    
    setWebinars(prev => prev.map(webinar => {
      if (webinar.id === id && (currentUser.role === 'admin' || webinar.createdBy === currentUser.id)) {
        return { ...webinar, ...updates };
      }
      return webinar;
    }));
  };

  const updateAnalytics = (webinarId: string, analytics: Partial<WebinarAnalytics>) => {
    setWebinars(prev => prev.map(webinar => {
      if (webinar.id === webinarId) {
        return {
          ...webinar,
          analytics: {
            ...webinar.analytics,
            ...analytics,
            viewerHistory: [
              ...webinar.analytics.viewerHistory,
              {
                timestamp: new Date(),
                count: analytics.uniqueViewers || webinar.analytics.uniqueViewers
              }
            ]
          }
        };
      }
      return webinar;
    }));
  };

  const removeWebinar = (id: string) => {
    if (!currentUser) return;
    
    setWebinars(prev => prev.filter(webinar => {
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
      canManageWebinar,
      updateAnalytics
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