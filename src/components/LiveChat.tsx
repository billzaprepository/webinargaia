import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { useWebinar } from '../context/WebinarContext';
import { Webinar } from '../types/webinar';

interface LiveChatProps {
  webinar: Webinar;
}

const LiveChat: React.FC<LiveChatProps> = ({ webinar }) => {
  const [displayedMessages, setDisplayedMessages] = useState(webinar.messages);
  const { updateAnalytics } = useWebinar();

  useEffect(() => {
    if (!webinar || !webinar.schedule) {
      setDisplayedMessages([]);
      return;
    }

    const now = new Date();
    const webinarElapsed = Math.floor((now.getTime() - webinar.schedule.startTime.getTime()) / 1000);

    // Filter messages that should be shown based on elapsed time
    const visibleMessages = webinar.messages.filter(
      msg => msg.scheduledTime <= webinarElapsed
    );

    setDisplayedMessages(visibleMessages);

    // Update analytics
    updateAnalytics(webinar.id, {
      chatMessages: webinar.messages.length,
      engagementRate: Math.round(((webinar.messages.length + webinar.analytics.ctaClicks.reduce((sum, click) => sum + click.clicks, 0)) / webinar.analytics.totalViews) * 100)
    });

    // Set up interval to check for new messages
    const interval = setInterval(() => {
      const currentTime = new Date();
      const elapsed = Math.floor((currentTime.getTime() - webinar.schedule.startTime.getTime()) / 1000);
      
      setDisplayedMessages(webinar.messages.filter(
        msg => msg.scheduledTime <= elapsed
      ));
    }, 1000);

    return () => clearInterval(interval);
  }, [webinar, webinar.messages.length]);

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat ao vivo</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {displayedMessages.map((msg) => (
          <ChatMessage
            key={msg.id}
            username={msg.username}
            message={msg.message}
            timestamp={msg.timestamp}
          />
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Envie uma mensagem..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;