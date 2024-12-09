import { useState, useCallback } from 'react';
import { storageService } from '../services/storage/StorageService';
import { VideoMetadata } from '../services/storage/types';

export const useStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadVideo = useCallback(async (file: File): Promise<VideoMetadata> => {
    setIsLoading(true);
    setProgress(0);
    setError(null);

    try {
      if (!file.type.startsWith('video/')) {
        throw new Error('Invalid file type. Please upload a video file.');
      }

      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const metadata = await storageService.uploadVideo(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      return metadata;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteVideo = useCallback(async (fileName: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await storageService.deleteVideo(fileName);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Delete failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listVideos = useCallback(async (): Promise<VideoMetadata[]> => {
    setIsLoading(true);
    setError(null);

    try {
      return await storageService.listVideos();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to list videos');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    uploadVideo,
    deleteVideo,
    listVideos,
    isLoading,
    progress,
    error
  };
};