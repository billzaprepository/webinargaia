import React, { useEffect, useState } from 'react';
import { CTAButton } from '../types/webinar';
import CountdownTimer from './CountdownTimer';
import { useWebinar } from '../context/WebinarContext';

interface CTADisplayProps {
  buttons: CTAButton[];
  webinarStartTime: Date;
  webinarId: string;
}

const CTADisplay: React.FC<CTADisplayProps> = ({ buttons, webinarStartTime, webinarId }) => {
  const [visibleButtons, setVisibleButtons] = useState<CTAButton[]>([]);
  const { updateAnalytics } = useWebinar();

  useEffect(() => {
    const checkButtonVisibility = () => {
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - webinarStartTime.getTime()) / 1000);

      const currentlyVisible = buttons.filter(button => {
        const showUntil = button.showAt + button.duration;
        return elapsedSeconds >= button.showAt && elapsedSeconds < showUntil;
      });

      setVisibleButtons(currentlyVisible);
    };

    const interval = setInterval(checkButtonVisibility, 1000);
    return () => clearInterval(interval);
  }, [buttons, webinarStartTime]);

  const handleButtonClick = (buttonId: string) => {
    updateAnalytics(webinarId, {
      ctaClicks: [{ buttonId, clicks: 1 }]
    });
  };

  const handleButtonExpire = (buttonId: string) => {
    setVisibleButtons(prev => prev.filter(button => button.id !== buttonId));
  };

  if (visibleButtons.length === 0) return null;

  const getTimerPosition = (position: string = 'above') => {
    switch (position) {
      case 'below':
        return 'flex-col-reverse';
      case 'left':
        return 'flex-row';
      case 'right':
        return 'flex-row-reverse';
      default:
        return 'flex-col';
    }
  };

  return (
    <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-4 p-4">
      {visibleButtons.map(button => (
        <div 
          key={button.id} 
          className={`relative flex items-center gap-2 ${getTimerPosition(button.position)}`}
        >
          <CountdownTimer
            duration={button.duration}
            onComplete={() => handleButtonExpire(button.id)}
            backgroundColor={button.backgroundColor}
            opacity={button.opacity}
          />
          <a
            href={button.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg text-white font-medium shadow-lg hover:opacity-90 transition-opacity animate-bounce"
            style={{ backgroundColor: button.color }}
            onClick={() => handleButtonClick(button.id)}
          >
            {button.text}
          </a>
        </div>
      ))}
    </div>
  );
};

export default CTADisplay;