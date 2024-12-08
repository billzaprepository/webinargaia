import { minioService } from './minio';
import { videoDB } from './db';

interface VideoMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  objectName: string;
  url: string;
}

class StorageService {
  async saveVideo(id: string, file: File): Promise<void> {
    try {
      // Upload to MinIO
      const objectName = await minioService.uploadVideo(file);
      const url = minioService.getVideoUrl(objectName);

      // Save metadata to IndexedDB
      await videoDB.updateMetadata(id, {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        objectName,
        url
      });
    } catch (error) {
      console.error('Error saving video:', error);
      throw new Error('Failed to save video');
    }
  }

  async getVideo(id: string): Promise<{ file: File; url: string } | null> {
    try {
      const metadata = await videoDB.getVideoMetadata(id);
      if (!metadata || !metadata.objectName) return null;

      const buffer = await minioService.getVideo(metadata.objectName);
      const file = new File([buffer], metadata.name, { type: metadata.type });

      return {
        file,
        url: minioService.getVideoUrl(metadata.objectName)
      };
    } catch (error) {
      console.error('Error retrieving video:', error);
      return null;
    }
  }

  async deleteVideo(id: string): Promise<void> {
    try {
      const metadata = await videoDB.getVideoMetadata(id);
      if (metadata?.objectName) {
        await minioService.deleteVideo(metadata.objectName);
      }
      await videoDB.deleteVideo(id);
    } catch (error) {
      console.error('Error deleting video:', error);
      throw new Error('Failed to delete video');
    }
  }

  async getAllVideos(): Promise<VideoMetadata[]> {
    try {
      const dbRecords = await videoDB.getAllVideos();
      return dbRecords.map(record => ({
        id: record.id,
        name: record.metadata.name,
        size: record.metadata.size,
        type: record.metadata.type,
        objectName: record.metadata.objectName,
        url: minioService.getVideoUrl(record.metadata.objectName)
      }));
    } catch (error) {
      console.error('Error retrieving all videos:', error);
      return [];
    }
  }
}

export const storageService = new StorageService();