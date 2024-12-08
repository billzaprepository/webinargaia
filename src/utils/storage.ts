import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Config = {
  endpoint: import.meta.env.VITE_S3_ENDPOINT || 'http://localhost:9000',
  region: import.meta.env.VITE_S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: import.meta.env.VITE_S3_SECRET_KEY || 'minioadmin'
  },
  forcePathStyle: true
};

const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET || 'webinar-videos';

class StorageService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      ...s3Config,
      forcePathStyle: true,
      region: s3Config.region
    });
  }

  async uploadFile(file: File, key: string): Promise<string> {
    try {
      const buffer = await file.arrayBuffer();
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type
      });

      await this.s3Client.send(command);
      return this.getPublicUrl(key);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
      });
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  private getPublicUrl(key: string): string {
    return `${s3Config.endpoint}/${BUCKET_NAME}/${key}`;
  }
}

export const storageService = new StorageService();