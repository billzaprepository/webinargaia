import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface WebinarCountdownProps {
  startTime: Date;
}

const WebinarCountdown: React.FC<WebinarCountdownProps> = ({ startTime }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = startTime.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-blue-600 text-white rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-sm text-gray-600 mt-1">{label}</span>
    </div>
  );

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 text-gray-800 mb-4">
        <Clock className="w-5 h-5" />
        <h2 className="text-lg font-semibold">O webinar começa em:</h2>
      </div>
      <div className="flex justify-center gap-6">
        {timeLeft.days > 0 && (
          <TimeUnit value={timeLeft.days} label="dias" />
        )}
        <TimeUnit value={timeLeft.hours} label="horas" />
        <TimeUnit value={timeLeft.minutes} label="minutos" />
        <TimeUnit value={timeLeft.seconds} label="segundos" />
      </div>
    </div>
  );
};

export default WebinarCountdown;