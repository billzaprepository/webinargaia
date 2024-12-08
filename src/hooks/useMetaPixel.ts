import { useEffect } from 'react';
import { Webinar } from '../types/webinar';

declare global {
  interface Window {
    fbq: any;
  }
}

export const useMetaPixel = (webinar: Webinar) => {
  useEffect(() => {
    if (webinar?.metaPixel?.enabled && webinar.metaPixel.pixelId) {
      // Initialize Meta Pixel
      window.fbq('init', webinar.metaPixel.pixelId);

      // Track PageView if enabled
      if (webinar.metaPixel.trackPageView) {
        window.fbq('track', 'PageView');
      }
    }
  }, [webinar?.metaPixel]);

  const trackEvent = (eventName: string, data?: object) => {
    if (webinar?.metaPixel?.enabled && webinar.metaPixel.pixelId) {
      window.fbq('track', eventName, data);
    }
  };

  return { trackEvent };
};