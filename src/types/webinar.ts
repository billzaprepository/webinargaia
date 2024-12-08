import { WebinarTheme } from './theme';

export interface GTMSettings {
  containerId: string;
  enabled: boolean;
  trackPageView: boolean;
  trackEvents: boolean;
  trackEcommerce: boolean;
}

export interface MetaPixelSettings {
  pixelId: string;
  enabled: boolean;
  trackPageView: boolean;
  trackConversion: boolean;
  trackSubscription: boolean;
}

export interface WebinarAnalytics {
  totalViews: number;
  uniqueViewers: number;
  averageWatchTime: number;
  engagementRate: number;
  peakViewers: number;
  viewerHistory: {
    timestamp: Date;
    count: number;
  }[];
  chatMessages: number;
  ctaClicks: {
    buttonId: string;
    clicks: number;
  }[];
}

export interface Webinar {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  schedule: WebinarSchedule;
  messages: ChatMessage[];
  video: File | null;
  createdBy: string;
  isActive: boolean;
  ctaButtons: CTAButton[];
  theme: WebinarTheme;
  analytics: WebinarAnalytics;
  metaPixel?: MetaPixelSettings;
  gtm?: GTMSettings;
}

// ... rest of the types ...