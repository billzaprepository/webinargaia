import { 
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  ListBucketsCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from '../../config/environment';
import { v4 as uuidv4 } from 'uuid';

export interface VideoMetadata {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  uploadDate: Date;
  url: string;
}

class VideoStorage {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor() {
    this.client = new S3Client({
      endpoint: env.MINIO_SERVER_URL,
      region: env.MINIO_REGION,
      credentials: {
        accessKeyId: env.MINIO_ACCESS_KEY,
        secretAccessKey: env.MINIO_SECRET_KEY
      },
      forcePathStyle: true,
      tls: env.MINIO_USE_SSL
    });
    this.bucket = env.MINIO_BUCKET_NAME;
    this.initializeBucket().catch(console.error);
  }

  private async initializeBucket(): Promise<void> {
    try {
      const { Buckets = [] } = await this.client.send(new ListBucketsCommand({}));
      
      if (!Buckets.some(b => b.Name === this.bucket)) {
        await this.client.send(new CreateBucketCommand({ 
          Bucket: this.bucket,
          CreateBucketConfiguration: {
            LocationConstraint: env.MINIO_REGION
          }
        }));
        
        const policy = {
          Version: '2012-10-17',
          Statement: [{
            Sid: 'PublicRead',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucket}/*`]
          }]
        };

        await this.client.send(new PutBucketPolicyCommand({
          Bucket: this.bucket,
          Policy: JSON.stringify(policy)
        }));

        console.log(`Bucket ${this.bucket} created successfully`);
      }
    } catch (error) {
      console.error('Failed to initialize bucket:', error);
      throw new Error('Storage initialization failed');
    }
  }

  private async getSignedObjectUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    });
    return getSignedUrl(this.client, command, { expiresIn: 86400 });
  }

  async uploadVideo(file: File): Promise<VideoMetadata> {
    try {
      const fileId = uuidv4();
      const extension = file.name.split('.').pop();
      const key = `${fileId}.${extension}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      await this.client.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ContentDisposition: 'inline'
      }));

      const url = await this.getSignedObjectUrl(key);

      return {
        id: fileId,
        fileName: key,
        contentType: file.type,
        size: file.size,
        uploadDate: new Date(),
        url
      };
    } catch (error) {
      console.error('Failed to upload video:', error);
      throw new Error('Video upload failed');
    }
  }

  async deleteVideo(fileName: string): Promise<void> {
    try {
      await this.client.send(new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: fileName
      }));
    } catch (error) {
      console.error('Failed to delete video:', error);
      throw new Error('Video deletion failed');
    }
  }

  async listVideos(): Promise<VideoMetadata[]> {
    try {
      const { Contents = [] } = await this.client.send(new ListObjectsCommand({
        Bucket: this.bucket
      }));

      return Promise.all(Contents.map(async (object) => {
        const url = await this.getSignedObjectUrl(object.Key!);
        
        return {
          id: object.Key!.split('.')[0],
          fileName: object.Key!,
          contentType: 'video/mp4',
          size: object.Size!,
          uploadDate: object.LastModified!,
          url
        };
      }));
    } catch (error) {
      console.error('Failed to list videos:', error);
      throw new Error('Failed to retrieve video list');
    }
  }
}

export const videoStorage = new VideoStorage();