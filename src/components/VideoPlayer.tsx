import React, { useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import LiveViewerCounter from './LiveViewerCounter';
import CTADisplay from './CTADisplay';
import { Webinar } from '../types/webinar';

interface VideoPlayerProps {
  webinar: Webinar;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ webinar }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (webinar.schedule.status === 'live' && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  }, [webinar.schedule.status]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {webinar.video ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          controls
          playsInline
          onClick={handlePlayPause}
        >
          <source src={URL.createObjectURL(webinar.video)} type="video/mp4" />
          Seu navegador não suporta a reprodução de vídeos.
        </video>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-lg">Aguardando início do webinar...</p>
        </div>
      )}

      <div className="absolute top-4 right-4">
        <LiveViewerCounter />
      </div>

      <CTADisplay
        buttons={webinar.ctaButtons}
        webinarStartTime={webinar.schedule.startTime}
      />
    </div>
  );
};

export default VideoPlayer;