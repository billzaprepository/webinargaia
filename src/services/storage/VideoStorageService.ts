import { 
  PutObjectCommand, 
  DeleteObjectCommand, 
  ListObjectsCommand, 
  GetObjectCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  ListBucketsCommand,
  S3Client
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

class VideoStorageService {
  private s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      endpoint: env.MINIO_SERVER_URL,
      region: "us-east-1",
      credentials: {
        accessKeyId: env.MINIO_ACCESS_KEY,
        secretAccessKey: env.MINIO_SECRET_KEY
      },
      forcePathStyle: true,
      tls: env.MINIO_USE_SSL
    });
    this.bucketName = env.MINIO_BUCKET_NAME;
  }

  async initializeBucket(): Promise<void> {
    try {
      const { Buckets = [] } = await this.s3Client.send(new ListBucketsCommand({}));
      const bucketExists = Buckets.some(bucket => bucket.Name === this.bucketName);

      if (!bucketExists) {
        await this.s3Client.send(new CreateBucketCommand({
          Bucket: this.bucketName
        }));

        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'PublicRead',
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`]
            }
          ]
        };

        await this.s3Client.send(new PutBucketPolicyCommand({
          Bucket: this.bucketName,
          Policy: JSON.stringify(policy)
        }));

        console.log(`Bucket ${this.bucketName} created successfully`);
      }
    } catch (error) {
      console.error('Error initializing bucket:', error);
      throw error;
    }
  }

  async uploadVideo(file: File): Promise<VideoMetadata> {
    try {
      const fileId = uuidv4();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${fileId}.${fileExtension}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: file.type
      });

      await this.s3Client.send(uploadCommand);

      const getCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileName
      });

      const url = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 86400 });

      return {
        id: fileId,
        fileName,
        contentType: file.type,
        size: file.size,
        uploadDate: new Date(),
        url
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }

  async deleteVideo(fileName: string): Promise<void> {
    try {
      await this.s3Client.send(new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileName
      }));
    } catch (error) {
      console.error('Error deleting video:', error);
      throw new Error('Failed to delete video');
    }
  }

  async listVideos(): Promise<VideoMetadata[]> {
    try {
      const { Contents = [] } = await this.s3Client.send(new ListObjectsCommand({
        Bucket: this.bucketName
      }));

      return Promise.all(
        Contents.map(async (object) => {
          const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: object.Key!
          });

          const url = await getSignedUrl(this.s3Client, command, { expiresIn: 86400 });

          return {
            id: object.Key!.split('.')[0],
            fileName: object.Key!,
            contentType: 'video/mp4',
            size: object.Size!,
            uploadDate: object.LastModified!,
            url
          };
        })
      );
    } catch (error) {
      console.error('Error listing videos:', error);
      throw new Error('Failed to list videos');
    }
  }
}

export const videoStorageService = new VideoStorageService();

// Initialize bucket when service is imported
videoStorageService.initializeBucket().catch(console.error);