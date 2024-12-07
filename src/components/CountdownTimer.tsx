import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  duration: number;
  onComplete?: () => void;
  backgroundColor?: string;
  opacity?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration,
  onComplete,
  backgroundColor = '#000000',
  opacity = '40'
}) => {
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

  const timerStyle = {
    color: '#FFFFFF',
    backgroundColor: `${backgroundColor}${Math.round(parseInt(opacity) * 2.55).toString(16).padStart(2, '0')}`,
  };

  return (
    <div 
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
      style={timerStyle}
    >
      <Clock size={14} />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default CountdownTimer;