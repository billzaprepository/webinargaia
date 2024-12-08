import { useEffect, useState } from 'react';
import { Webinar } from '../types/webinar';
import { videoDB } from '../utils/db';

export const usePublicWebinar = (slug: string | undefined) => {
  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWebinar = async () => {
      if (!slug) {
        setError('Invalid webinar URL');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get webinar data from IndexedDB
        const webinarData = await videoDB.getWebinarBySlug(slug);
        
        if (!webinarData) {
          setError('Webinar not found');
          return;
        }

        // Check if webinar is public or requires authentication
        if (!webinarData.isPublic) {
          setError('This webinar requires authentication');
          return;
        }

        setWebinar(webinarData);
      } catch (err) {
        console.error('Error loading webinar:', err);
        setError('Failed to load webinar');
      } finally {
        setIsLoading(false);
      }
    };

    loadWebinar();
  }, [slug]);

  return { webinar, isLoading, error };
};