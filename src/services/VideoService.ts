import { PutObjectCommand, DeleteObjectCommand, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, VIDEOS_BUCKET } from '../config/storage';
import { v4 as uuidv4 } from 'uuid';

export interface VideoMetadata {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  uploadDate: Date;
  url: string;
}

class VideoService {
  private readonly CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

  async uploadVideo(file: File): Promise<VideoMetadata> {
    try {
      const fileId = uuidv4();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${fileId}.${fileExtension}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await s3Client.send(new PutObjectCommand({
        Bucket: VIDEOS_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: file.type
      }));

      const command = new GetObjectCommand({
        Bucket: VIDEOS_BUCKET,
        Key: fileName
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn: 86400 });

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
      await s3Client.send(new DeleteObjectCommand({
        Bucket: VIDEOS_BUCKET,
        Key: fileName
      }));
    } catch (error) {
      console.error('Error deleting video:', error);
      throw new Error('Failed to delete video');
    }
  }

  async listVideos(): Promise<VideoMetadata[]> {
    try {
      const { Contents = [] } = await s3Client.send(new ListObjectsCommand({
        Bucket: VIDEOS_BUCKET
      }));

      return Promise.all(
        Contents.map(async (object) => {
          const command = new GetObjectCommand({
            Bucket: VIDEOS_BUCKET,
            Key: object.Key!
          });

          const url = await getSignedUrl(s3Client, command, { expiresIn: 86400 });

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

export const videoService = new VideoService();