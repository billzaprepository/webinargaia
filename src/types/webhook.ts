import { Webinar } from './webinar';

export interface WebhookConfig {
  id: string;
  url: string;
  secret: string;
  enabled: boolean;
  events: WebhookEvent[];
  createdAt: Date;
  lastTriggered?: Date;
  lastStatus?: number;
}

export type WebhookEvent = 
  | 'webinar.started'
  | 'webinar.reminder'
  | 'webinar.ended';

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  webinar: {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    currentViewers?: number;
    totalViews?: number;
  };
}