import { S3Client } from "@aws-sdk/client-s3";
import { env } from './environment';

// Create S3 client with MinIO configuration
export const s3Client = new S3Client({
  endpoint: env.MINIO_SERVER_URL,
  region: "us-east-1", // Required but not used by MinIO
  credentials: {
    accessKeyId: env.MINIO_ACCESS_KEY,
    secretAccessKey: env.MINIO_SECRET_KEY
  },
  forcePathStyle: true, // Required for MinIO
  tls: env.MINIO_USE_SSL // Enable SSL/TLS
});

export const VIDEOS_BUCKET = env.MINIO_BUCKET_NAME;