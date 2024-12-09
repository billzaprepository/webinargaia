import AWS from 'aws-sdk';
import { env } from './environment';

// Configure AWS SDK with custom endpoint
const endpoint = new AWS.Endpoint(env.MINIO_SERVER_URL);

// Create S3 client with custom configuration
export const s3Client = new AWS.S3({
  endpoint: endpoint,
  credentials: new AWS.Credentials({
    accessKeyId: env.MINIO_ACCESS_KEY,
    secretAccessKey: env.MINIO_SECRET_KEY
  }),
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  sslEnabled: env.MINIO_USE_SSL,
  httpOptions: {
    timeout: 10000,
    connectTimeout: 10000
  }
});

export const VIDEOS_BUCKET = env.MINIO_BUCKET_NAME;

// Initialize bucket if it doesn't exist
export const initializeBucket = async () => {
  try {
    const { Buckets = [] } = await s3Client.listBuckets().promise();
    const bucketExists = Buckets.some(bucket => bucket.Name === VIDEOS_BUCKET);

    if (!bucketExists) {
      await s3Client.createBucket({
        Bucket: VIDEOS_BUCKET,
        CreateBucketConfiguration: {
          LocationConstraint: 'us-east-1'
        }
      }).promise();

      // Set bucket policy for public read access
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicRead',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${VIDEOS_BUCKET}/*`]
          }
        ]
      };

      await s3Client.putBucketPolicy({
        Bucket: VIDEOS_BUCKET,
        Policy: JSON.stringify(policy)
      }).promise();

      console.log(`Bucket ${VIDEOS_BUCKET} created successfully`);
    }
  } catch (error) {
    console.error('Error initializing bucket:', error);
    if (error.code === 'NetworkingError') {
      console.error('Network error details:', {
        endpoint: env.MINIO_SERVER_URL,
        ssl: env.MINIO_USE_SSL,
        bucket: VIDEOS_BUCKET
      });
    }
    throw error;
  }
};

// Generate pre-signed URL for upload
export const getUploadUrl = async (fileName: string): Promise<string> => {
  const params = {
    Bucket: VIDEOS_BUCKET,
    Key: fileName,
    Expires: 3600,
    ContentType: 'video/*'
  };

  return s3Client.getSignedUrl('putObject', params);
};

// Generate pre-signed URL for viewing
export const getViewUrl = async (fileName: string): Promise<string> => {
  const params = {
    Bucket: VIDEOS_BUCKET,
    Key: fileName,
    Expires: 86400 // 24 hours
  };

  return s3Client.getSignedUrl('getObject', params);
};

// Initialize bucket when module is imported
initializeBucket().catch(console.error);