import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const LiveViewerCounter: React.FC = () => {
  const [viewerCount, setViewerCount] = useState(208);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(current => {
        const randomChange = Math.floor(Math.random() * 20) - 10; // Random number between -10 and 10
        const newCount = current + randomChange;
        
        // Keep count between 208 and 698
        if (newCount < 208) return 208;
        if (newCount > 698) return 698;
        return newCount;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full">
      <Users size={16} className="text-white" />
      <span className="text-white text-sm font-medium">
        {viewerCount.toLocaleString()} assistindo
      </span>
    </div>
  );
};

export default LiveViewerCounter;