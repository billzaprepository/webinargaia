import { Client } from 'minio';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/environment';

const BUCKET_NAME = env.MINIO_BUCKET_NAME;

class MinioService {
  private client: Client;

  constructor() {
    this.client = new Client({
      endPoint: env.MINIO_ENDPOINT,
      port: env.MINIO_PORT,
      useSSL: env.MINIO_USE_SSL,
      accessKey: env.MINIO_ACCESS_KEY,
      secretKey: env.MINIO_SECRET_KEY
    });
    this.initBucket();
  }

  private async initBucket() {
    try {
      const exists = await this.client.bucketExists(BUCKET_NAME);
      if (!exists) {
        await this.client.makeBucket(BUCKET_NAME);
        console.log('Bucket created successfully');
      }
    } catch (error) {
      console.error('Error initializing bucket:', error);
    }
  }

  async uploadVideo(file: File): Promise<string> {
    try {
      const objectId = uuidv4();
      const objectName = `${objectId}-${file.name}`;
      const buffer = await file.arrayBuffer();
      
      await this.client.putObject(
        BUCKET_NAME,
        objectName,
        Buffer.from(buffer),
        file.size,
        { 'Content-Type': file.type }
      );

      return objectName;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }

  async getVideo(objectName: string): Promise<Buffer> {
    try {
      const dataStream = await this.client.getObject(BUCKET_NAME, objectName);
      const chunks: Buffer[] = [];
      
      return new Promise((resolve, reject) => {
        dataStream.on('data', chunk => chunks.push(chunk));
        dataStream.on('end', () => resolve(Buffer.concat(chunks)));
        dataStream.on('error', reject);
      });
    } catch (error) {
      console.error('Error retrieving video:', error);
      throw new Error('Failed to retrieve video');
    }
  }

  async deleteVideo(objectName: string): Promise<void> {
    try {
      await this.client.removeObject(BUCKET_NAME, objectName);
    } catch (error) {
      console.error('Error deleting video:', error);
      throw new Error('Failed to delete video');
    }
  }

  async listVideos(): Promise<string[]> {
    try {
      const objectsList: string[] = [];
      const stream = this.client.listObjects(BUCKET_NAME);
      
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

  getVideoUrl(objectName: string): string {
    return `https://${env.MINIO_ENDPOINT}/${BUCKET_NAME}/${objectName}`;
  }
}

export const minioService = new MinioService();