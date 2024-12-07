import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Radio, CheckCircle } from 'lucide-react';
import LiveViewerCounter from './LiveViewerCounter';
import CTADisplay from './CTADisplay';
import { Webinar } from '../types/webinar';

interface VideoPlayerProps {
  webinar: Webinar;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ webinar }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [hasAttemptedPlay, setHasAttemptedPlay] = useState(false);
  const now = new Date();
  const isLive = now >= webinar.schedule.startTime && now <= webinar.schedule.endTime;
  const hasFinished = now > webinar.schedule.endTime;

  useEffect(() => {
    let playAttemptInterval: NodeJS.Timeout;
    let stateCheckInterval: NodeJS.Timeout;
    let startTimeoutId: NodeJS.Timeout;

    const attemptPlay = async () => {
      if (videoRef.current && !isPlaying && !hasEnded) {
        try {
          // Configure video element
          videoRef.current.controls = false;
          videoRef.current.muted = true; // Start muted to ensure autoplay works
          videoRef.current.currentTime = 0; // Start from beginning
          videoRef.current.loop = false; // Disable looping
          
          // Attempt to play
          await videoRef.current.play();
          setIsPlaying(true);
          setHasAttemptedPlay(true);

          // After successful play, try to unmute
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.volume = 1;
            }
          }, 1000);
        } catch (error) {
          console.error('Error playing video:', error);
          setHasAttemptedPlay(false);
        }
      }
    };

    const scheduleVideoStart = () => {
      const now = new Date();
      const startTime = new Date(webinar.schedule.startTime);
      const timeUntilStart = startTime.getTime() - now.getTime();

      if (timeUntilStart > 0) {
        // Schedule video to start exactly at start time
        startTimeoutId = setTimeout(attemptPlay, timeUntilStart);
      } else if (isLive && !isPlaying && !hasEnded) {
        // If we're already in the live window but video isn't playing, try to play immediately
        attemptPlay();
      }
    };

    const checkState = () => {
      const currentTime = new Date();
      const shouldBePlaying = currentTime >= webinar.schedule.startTime && 
                            currentTime <= webinar.schedule.endTime;

      if (shouldBePlaying && !isPlaying && !hasEnded) {
        attemptPlay();
      } else if (!shouldBePlaying && isPlaying) {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
          setHasAttemptedPlay(false);
          if (currentTime > webinar.schedule.endTime) {
            setHasEnded(true);
          }
        }
      }
    };

    // Handle video end
    const handleVideoEnd = () => {
      setHasEnded(true);
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('ended', handleVideoEnd);
    }

    // Initial setup
    scheduleVideoStart();
    
    // Set up intervals for continuous checking
    stateCheckInterval = setInterval(checkState, 1000);
    
    // Only set up play attempt interval if we haven't successfully played yet
    if (!hasAttemptedPlay && isLive && !hasEnded) {
      playAttemptInterval = setInterval(attemptPlay, 2000);
    }

    return () => {
      clearInterval(stateCheckInterval);
      clearTimeout(startTimeoutId);
      if (playAttemptInterval) {
        clearInterval(playAttemptInterval);
      }
      if (videoRef.current) {
        videoRef.current.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [webinar.schedule.startTime, webinar.schedule.endTime, isPlaying, isLive, hasAttemptedPlay, hasEnded]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const volume = Number(e.target.value);
      videoRef.current.volume = volume;
      videoRef.current.muted = volume === 0;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // End screen component
  const EndScreen = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
      <div className="text-center text-white p-8">
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Webinar Finalizado</h2>
        <p className="text-gray-300">
          Obrigado por participar! Este webinar foi encerrado em{' '}
          {new Date(webinar.schedule.endTime).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group">
      {webinar.video ? (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
          >
            <source src={URL.createObjectURL(webinar.video)} type="video/mp4" />
            Seu navegador não suporta a reprodução de vídeos.
          </video>

          {/* Show end screen if webinar has ended or video has ended */}
          {(hasEnded || hasFinished) && <EndScreen />}

          {/* Live Tag */}
          {isLive && !hasEnded && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
              <Radio size={14} className="animate-pulse" />
              AO VIVO
            </div>
          )}

          {/* Custom Controls - Bottom Left Corner */}
          {isPlaying && !hasEnded && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  <Volume2 size={20} />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="1"
                    onChange={handleVolumeChange}
                    className="w-24 accent-white"
                  />
                </div>
                
                <button
                  onClick={handleFullscreen}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-lg">
            {now < webinar.schedule.startTime
              ? 'Aguardando início do webinar...'
              : hasFinished
              ? 'Este webinar já foi encerrado.'
              : 'Carregando...'}
          </p>
        </div>
      )}

      <div className="absolute top-4 right-4">
        <LiveViewerCounter />
      </div>

      {isLive && !hasEnded && (
        <CTADisplay
          buttons={webinar.ctaButtons}
          webinarStartTime={webinar.schedule.startTime}
        />
      )}
    </div>
  );
};

export default VideoPlayer;