import { minioClient, VIDEOS_BUCKET, getUploadUrl, getViewUrl } from '../config/minio';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  async uploadVideo(file: File): Promise<string> {
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      
      // Upload do arquivo para o MinIO
      await minioClient.putObject(
        VIDEOS_BUCKET,
        fileName,
        await file.arrayBuffer(),
        file.size,
        { 'Content-Type': file.type }
      );

      return fileName;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }

  async getVideo(fileName: string): Promise<string> {
    try {
      // Gera URL pré-assinada válida por 24 horas
      const url = await getViewUrl(fileName);
      return url;
    } catch (error) {
      console.error('Error getting video:', error);
      throw new Error('Failed to get video');
    }
  }

  async deleteVideo(fileName: string): Promise<void> {
    try {
      await minioClient.removeObject(VIDEOS_BUCKET, fileName);
    } catch (error) {
      console.error('Error deleting video:', error);
      throw new Error('Failed to delete video');
    }
  }

  async listVideos(): Promise<string[]> {
    try {
      const objectsList: string[] = [];
      const stream = minioClient.listObjects(VIDEOS_BUCKET);
      
      return new Promise((resolve, reject) => {
        stream.on('data', obj => objectsList.push(obj.name));
        stream.on('end', () => resolve(objectsList));
        stream.on('error', reject);
      });
    } catch (error) {
      console.error('Error listing videos:', error);
      throw new Error('Failed to list videos');
    }
  }
}

export const storageService = new StorageService();