import { 
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { VideoMetadata } from './types';
import { v4 as uuidv4 } from 'uuid';

export const uploadVideo = async (
  client: S3Client,
  bucket: string,
  file: File
): Promise<VideoMetadata> => {
  const fileId = uuidv4();
  const extension = file.name.split('.').pop();
  const key = `${fileId}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    ContentDisposition: 'inline',
    CacheControl: 'max-age=31536000'
  }));

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  });

  const url = await getSignedUrl(client, command, { expiresIn: 86400 });

  return {
    id: fileId,
    fileName: key,
    contentType: file.type,
    size: file.size,
    uploadDate: new Date(),
    url
  };
};

export const deleteVideo = async (
  client: S3Client,
  bucket: string,
  fileName: string
): Promise<void> => {
  await client.send(new DeleteObjectCommand({
    Bucket: bucket,
    Key: fileName
  }));
};

export const listVideos = async (
  client: S3Client,
  bucket: string
): Promise<VideoMetadata[]> => {
  const { Contents = [] } = await client.send(new ListObjectsCommand({
    Bucket: bucket
  }));

  return Promise.all(Contents.map(async (object) => {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: object.Key!
    });

    const url = await getSignedUrl(client, command, { expiresIn: 86400 });

    return {
      id: object.Key!.split('.')[0],
      fileName: object.Key!,
      contentType: 'video/mp4',
      size: object.Size!,
      uploadDate: object.LastModified!,
      url
    };
  }));
};