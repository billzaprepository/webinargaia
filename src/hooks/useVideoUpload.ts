import { useState, useCallback } from 'react';
import { videoStorage, VideoMetadata } from '../services/storage/VideoStorage';

interface UseVideoUploadResult {
  uploadVideo: (file: File) => Promise<VideoMetadata>;
  isUploading: boolean;
  progress: number;
  error: Error | null;
}

export const useVideoUpload = (): UseVideoUploadResult => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadVideo = useCallback(async (file: File): Promise<VideoMetadata> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      if (!file.type.startsWith('video/')) {
        throw new Error('Invalid file type. Please upload a video file.');
      }

      const updateProgress = () => {
        setProgress(prev => Math.min(prev + 10, 90));
      };

      const progressInterval = setInterval(updateProgress, 500);
      const metadata = await videoStorage.uploadVideo(file);
      clearInterval(progressInterval);
      setProgress(100);
      
      return metadata;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      setError(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    uploadVideo,
    isUploading,
    progress,
    error
  };
};