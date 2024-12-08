import React, { createContext, useContext, useState, useEffect } from 'react';
import { Webinar, WebinarState, WebinarTheme } from '../types/webinar';
import { useAuth } from './AuthContext';
import { videoStorage } from '../utils/videoStorage';

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

  useEffect(() => {
    const loadStoredVideos = async () => {
      const storedVideos = await videoStorage.getAllVideos();
      setWebinars(prev => prev.map(webinar => {
        const storedVideo = storedVideos.find(v => v.id === webinar.id);
        return storedVideo ? { ...webinar, video: storedVideo.file } : webinar;
      }));
    };

    loadStoredVideos();
  }, []);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const addWebinar = async (newWebinar: Omit<Webinar, 'id' | 'analytics'>) => {
    if (!currentUser) return null;
    
    const webinarId = Math.random().toString(36).substr(2, 9);
    const slug = generateSlug(newWebinar.title);
    
    const webinar: Webinar = {
      ...newWebinar,
      id: webinarId,
      slug,
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

    if (webinar.video) {
      await videoStorage.saveVideo(webinar.id, webinar.video);
    }
    
    setWebinars(prev => [...prev, webinar]);
    return webinar;
  };

  const updateWebinar = async (id: string, updates: Partial<Webinar>) => {
    if (!currentUser) return;
    
    if (updates.video) {
      await videoStorage.saveVideo(id, updates.video);
    }

    let newSlug: string | undefined;
    if (updates.title) {
      newSlug = generateSlug(updates.title);
    }

    setWebinars(prev => prev.map(webinar => {
      if (webinar.id === id && (currentUser.role === 'admin' || webinar.createdBy === currentUser.id)) {
        return { 
          ...webinar, 
          ...updates,
          ...(newSlug ? { slug: newSlug } : {})
        };
      }
      return webinar;
    }));
  };

  const removeWebinar = async (id: string) => {
    if (!currentUser) return;
    
    await videoStorage.deleteVideo(id);
    
    setWebinars(prev => prev.filter(webinar => {
      if (webinar.id === id) {
        return !(currentUser.role === 'admin' || webinar.createdBy === currentUser.id);
      }
      return true;
    }));
  };

  const getWebinarBySlug = (slug: string) => {
    return webinars.find(w => w.slug === slug);
  };

  const updateAnalytics = (webinarId: string) => {
    setWebinars(prev => prev.map(webinar => {
      if (webinar.id === webinarId) {
        const now = new Date();
        const startTime = new Date(webinar.schedule.startTime);
        const endTime = new Date(webinar.schedule.endTime);
        
        if (now >= startTime) {
          const timeElapsedMinutes = Math.max(0, (now.getTime() - startTime.getTime()) / (1000 * 60));
          const hasEnded = now > endTime;
          
          const baseViews = Math.min(timeElapsedMinutes * 2, 1000);
          const baseUniqueViewers = Math.floor(baseViews * 0.8);
          const baseWatchTime = hasEnded ? 45 : Math.min(timeElapsedMinutes, 45);
          const baseChatMessages = Math.floor(baseViews * 0.3);
          const engagement = Math.floor((baseChatMessages / (baseViews || 1)) * 100);

          return {
            ...webinar,
            analytics: {
              views: Math.floor(baseViews),
              uniqueViewers: Math.floor(baseUniqueViewers),
              watchTime: Math.floor(baseWatchTime),
              engagement: Math.min(engagement, 100),
              chatMessages: Math.floor(baseChatMessages),
              lastUpdated: now
            }
          };
        }
        return webinar;
      }
      return webinar;
    }));
  };

  return (
    <WebinarContext.Provider value={{
      webinars: currentUser?.role === 'admin' ? webinars : webinars.filter(w => w.createdBy === currentUser?.id),
      allWebinars: webinars,
      currentWebinar,
      addWebinar,
      updateWebinar,
      removeWebinar,
      setCurrentWebinar,
      getWebinarBySlug,
      canManageWebinar: (webinarId: string) => {
        if (!currentUser) return false;
        if (currentUser.role === 'admin') return true;
        const webinar = webinars.find(w => w.id === webinarId);
        return webinar?.createdBy === currentUser.id;
      },
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