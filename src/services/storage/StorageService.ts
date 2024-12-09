import { S3Client } from "@aws-sdk/client-s3";
import { VideoMetadata, StorageError } from './types';
import { StorageConfig, validateStorageConfig } from './config';
import { createS3Client } from './client';
import { ensureBucketExists } from './bucket';
import { uploadVideo, deleteVideo, listVideos } from './operations';

class StorageService {
  private client: S3Client | null = null;
  private bucket: string = '';
  private initialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  private getClient(): S3Client {
    if (!this.client) {
      throw new Error('Storage client not initialized');
    }
    return this.client;
  }

  async init(config: unknown) {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        const validConfig = validateStorageConfig(config);
        this.client = createS3Client(validConfig);
        this.bucket = validConfig.bucket;
        await ensureBucketExists(this.client, this.bucket, validConfig.region);
        this.initialized = true;
      } catch (error) {
        this.initialized = false;
        this.client = null;
        this.initializationPromise = null;
        throw error;
      }
    })();

    return this.initializationPromise;
  }

  async updateConfig(config: unknown): Promise<void> {
    this.initialized = false;
    this.client = null;
    this.initializationPromise = null;
    await this.init(config);
  }

  async testConnection(config: unknown): Promise<void> {
    const validConfig = validateStorageConfig(config);
    const testClient = createS3Client(validConfig);
    
    try {
      await ensureBucketExists(testClient, validConfig.bucket, validConfig.region);
    } catch (error) {
      const err = error as StorageError;
      if (err.$metadata?.httpStatusCode === 404) {
        // Bucket doesn't exist but connection works
        return;
      }
      throw new Error('Failed to connect to MinIO server');
    }
  }

  async uploadVideo(file: File): Promise<VideoMetadata> {
    if (!this.initialized) {
      throw new Error('Storage service not initialized');
    }

    try {
      return await uploadVideo(this.getClient(), this.bucket, file);
    } catch (error) {
      console.error('Failed to upload video:', error);
      throw new Error('Video upload failed');
    }
  }

  async deleteVideo(fileName: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('Storage service not initialized');
    }

    try {
      await deleteVideo(this.getClient(), this.bucket, fileName);
    } catch (error) {
      console.error('Failed to delete video:', error);
      throw new Error('Video deletion failed');
    }
  }

  async listVideos(): Promise<VideoMetadata[]> {
    if (!this.initialized) {
      throw new Error('Storage service not initialized');
    }

    try {
      return await listVideos(this.getClient(), this.bucket);
    } catch (error) {
      console.error('Failed to list videos:', error);
      throw new Error('Failed to retrieve video list');
    }
  }
}

export const storageService = new StorageService();