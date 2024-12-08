import { useEffect } from 'react';
import { Webinar } from '../types/webinar';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const useGTM = (webinar: Webinar) => {
  useEffect(() => {
    if (webinar?.gtm?.enabled && webinar.gtm.containerId) {
      // Initialize GTM
      window.dataLayer = window.dataLayer || [];
      
      // Push initial page view if enabled
      if (webinar.gtm.trackPageView) {
        window.dataLayer.push({
          'event': 'page_view',
          'page_title': document.title,
          'page_location': window.location.href,
          'webinar_id': webinar.id,
          'webinar_title': webinar.title
        });
      }
    }
  }, [webinar?.gtm]);

  const pushEvent = (eventName: string, data?: object) => {
    if (webinar?.gtm?.enabled && webinar.gtm.containerId) {
      window.dataLayer.push({
        'event': eventName,
        'webinar_id': webinar.id,
        'webinar_title': webinar.title,
        ...data
      });
    }
  };

  return { pushEvent };
};