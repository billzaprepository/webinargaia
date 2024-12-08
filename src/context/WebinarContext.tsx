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

  const addWebinar = (newWebinar: Omit<Webinar, 'id' | 'analytics'>) => {
    if (!currentUser) return null;
    
    const webinar: Webinar = {
      ...newWebinar,
      id: Math.random().toString(36).substr(2, 9),
      createdBy: currentUser.id,
      ctaButtons: [],
      theme: defaultTheme,
      messages: [],
      analytics: {
        views: 0,
        uniqueViewers: 0,
        watchTime: 0,
        engagement: 0,
        chatMessages: 0,
        lastUpdated: new Date()
      }
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

  const updateAnalytics = (webinarId: string) => {
    setWebinars(prev => prev.map(webinar => {
      if (webinar.id === webinarId) {
        const now = new Date();
        const startTime = new Date(webinar.schedule.startTime);
        const endTime = new Date(webinar.schedule.endTime);
        
        // Only update analytics if the webinar has started
        if (now >= startTime) {
          const timeElapsedMinutes = Math.max(0, (now.getTime() - startTime.getTime()) / (1000 * 60));
          const hasEnded = now > endTime;
          
          // Calculate base metrics
          const baseViews = Math.min(timeElapsedMinutes * 2, 1000); // Max 1000 views
          const baseUniqueViewers = Math.floor(baseViews * 0.8); // 80% of views are unique
          const baseWatchTime = hasEnded ? 45 : Math.min(timeElapsedMinutes, 45); // Max 45 minutes
          const baseChatMessages = Math.floor(baseViews * 0.3); // 30% of viewers send messages
          
          // Calculate engagement (messages per viewer)
          const engagement = Math.floor((baseChatMessages / (baseViews || 1)) * 100);

          return {
            ...webinar,
            analytics: {
              views: Math.floor(baseViews),
              uniqueViewers: Math.floor(baseUniqueViewers),
              watchTime: Math.floor(baseWatchTime),
              engagement: Math.min(engagement, 100), // Cap at 100%
              chatMessages: Math.floor(baseChatMessages),
              lastUpdated: now
            }
          };
        }
        
        // Return unchanged analytics if webinar hasn't started
        return webinar;
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