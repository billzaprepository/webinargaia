import React, { useEffect, useState } from 'react';
import { CTAButton } from '../types/webinar';

interface CTADisplayProps {
  buttons: CTAButton[];
  webinarStartTime: Date;
}

const CTADisplay: React.FC<CTADisplayProps> = ({ buttons, webinarStartTime }) => {
  const [visibleButtons, setVisibleButtons] = useState<CTAButton[]>([]);

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

  if (visibleButtons.length === 0) return null;

  return (
    <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-4 p-4">
      {visibleButtons.map(button => (
        <a
          key={button.id}
          href={button.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-lg text-white font-medium shadow-lg hover:opacity-90 transition-opacity animate-bounce"
          style={{ backgroundColor: button.color }}
        >
          {button.text}
        </a>
      ))}
    </div>
  );
};

export default CTADisplay;