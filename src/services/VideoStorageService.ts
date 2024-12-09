import AWS from 'aws-sdk';
import { s3Client, VIDEOS_BUCKET } from '../config/s3';
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
  private readonly CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

  async uploadVideo(file: File): Promise<VideoMetadata> {
    try {
      const fileId = uuidv4();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${fileId}.${fileExtension}`;

      // Start multipart upload
      const multipartUpload = await s3Client.createMultipartUpload({
        Bucket: VIDEOS_BUCKET,
        Key: fileName,
        ContentType: file.type
      }).promise();

      const uploadId = multipartUpload.UploadId;
      const parts: AWS.S3.CompletedPart[] = [];

      // Upload parts
      let partNumber = 1;
      let position = 0;

      while (position < file.size) {
        const end = Math.min(position + this.CHUNK_SIZE, file.size);
        const chunk = file.slice(position, end);

        const uploadPartResponse = await s3Client.uploadPart({
          Bucket: VIDEOS_BUCKET,
          Key: fileName,
          PartNumber: partNumber,
          UploadId: uploadId,
          Body: chunk,
          ContentLength: chunk.size
        }).promise();

        parts.push({
          ETag: uploadPartResponse.ETag!,
          PartNumber: partNumber
        });

        position = end;
        partNumber++;
      }

      // Complete multipart upload
      await s3Client.completeMultipartUpload({
        Bucket: VIDEOS_BUCKET,
        Key: fileName,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts }
      }).promise();

      // Get object URL
      const url = await s3Client.getSignedUrl('getObject', {
        Bucket: VIDEOS_BUCKET,
        Key: fileName,
        Expires: 86400 // 24 hours
      });

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
      await s3Client.deleteObject({
        Bucket: VIDEOS_BUCKET,
        Key: fileName
      }).promise();
    } catch (error) {
      console.error('Error deleting video:', error);
      throw new Error('Failed to delete video');
    }
  }

  async listVideos(): Promise<VideoMetadata[]> {
    try {
      const { Contents = [] } = await s3Client.listObjects({
        Bucket: VIDEOS_BUCKET
      }).promise();

      return Promise.all(
        Contents.map(async (object) => {
          const url = await s3Client.getSignedUrl('getObject', {
            Bucket: VIDEOS_BUCKET,
            Key: object.Key!,
            Expires: 86400
          });

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