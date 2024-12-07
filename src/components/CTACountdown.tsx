import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CTACountdownProps {
  duration: number;
  onComplete?: () => void;
}

const CTACountdown: React.FC<CTACountdownProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-1 text-sm text-white/80">
      <Clock size={14} />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default CTACountdown;