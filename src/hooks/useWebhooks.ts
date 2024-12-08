import { useEffect } from 'react';
import { Webinar } from '../types/webinar';
import { WebhookEvent, WebhookPayload } from '../types/webhook';

export const useWebhooks = (webinar: Webinar) => {
  useEffect(() => {
    if (!webinar?.webhooks?.length) return;

    const checkAndTriggerWebhooks = async () => {
      const now = new Date();
      const startTime = new Date(webinar.schedule.startTime);
      const endTime = new Date(webinar.schedule.endTime);
      const reminderTime = new Date(startTime.getTime() - 30 * 60 * 1000); // 30 minutes before

      let event: WebhookEvent | null = null;

      if (Math.abs(now.getTime() - startTime.getTime()) < 1000) {
        event = 'webinar.started';
      } else if (Math.abs(now.getTime() - reminderTime.getTime()) < 1000) {
        event = 'webinar.reminder';
      } else if (Math.abs(now.getTime() - endTime.getTime()) < 1000) {
        event = 'webinar.ended';
      }

      if (event) {
        const payload: WebhookPayload = {
          event,
          timestamp: now.toISOString(),
          webinar: {
            id: webinar.id,
            title: webinar.title,
            description: webinar.description,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            currentViewers: webinar.analytics?.uniqueViewers,
            totalViews: webinar.analytics?.totalViews
          }
        };

        webinar.webhooks
          .filter(webhook => webhook.enabled && webhook.events.includes(event!))
          .forEach(async webhook => {
            try {
              const response = await fetch(webhook.url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Webhook-Secret': webhook.secret
                },
                body: JSON.stringify(payload)
              });

              console.log(`Webhook ${event} sent to ${webhook.url}: ${response.status}`);
            } catch (error) {
              console.error(`Error sending webhook ${event} to ${webhook.url}:`, error);
            }
          });
      }
    };

    const interval = setInterval(checkAndTriggerWebhooks, 1000);
    return () => clearInterval(interval);
  }, [webinar]);
};