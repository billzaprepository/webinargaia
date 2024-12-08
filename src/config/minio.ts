import { Client } from 'minio';

const minioConfig = {
  endPoint: import.meta.env.VITE_MINIO_ENDPOINT || 'play.min.io',
  port: Number(import.meta.env.VITE_MINIO_PORT) || 9000,
  useSSL: import.meta.env.VITE_MINIO_USE_SSL === 'true',
  accessKey: import.meta.env.VITE_MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: import.meta.env.VITE_MINIO_SECRET_KEY || 'minioadmin',
  bucket: import.meta.env.VITE_MINIO_BUCKET || 'webinar-videos'
};

export const minioClient = new Client({
  endPoint: minioConfig.endPoint,
  port: minioConfig.port,
  useSSL: minioConfig.useSSL,
  accessKey: minioConfig.accessKey,
  secretKey: minioConfig.secretKey
});

export const BUCKET_NAME = minioConfig.bucket;

// Ensure bucket exists
export const initializeBucket = async () => {
  try {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      // Set bucket policy to allow public read access
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
          }
        ]
      };
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    }
  } catch (error) {
    console.error('Error initializing MinIO bucket:', error);
    throw error;
  }
};