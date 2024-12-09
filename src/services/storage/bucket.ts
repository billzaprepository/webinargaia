import { 
  CreateBucketCommand, 
  HeadBucketCommand,
  PutBucketPolicyCommand,
  S3Client,
  S3ServiceException
} from "@aws-sdk/client-s3";
import { StorageError } from './types';

export const ensureBucketExists = async (
  client: S3Client,
  bucket: string,
  region: string = 'ash-dc1'
): Promise<void> => {
  try {
    // First check if bucket exists
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    return;
  } catch (error) {
    if (error instanceof S3ServiceException) {
      if (error.$metadata?.httpStatusCode !== 404) {
        throw error;
      }
    } else {
      throw error;
    }
  }

  try {
    // Create bucket if it doesn't exist
    await client.send(new CreateBucketCommand({
      Bucket: bucket,
      CreateBucketConfiguration: {
        LocationConstraint: region
      }
    }));

    // Set bucket policy for public read access
    const policy = {
      Version: '2012-10-17',
      Statement: [{
        Sid: 'PublicRead',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucket}/*`]
      }]
    };

    await client.send(new PutBucketPolicyCommand({
      Bucket: bucket,
      Policy: JSON.stringify(policy)
    }));

    console.log(`Bucket ${bucket} created successfully in region ${region}`);
  } catch (error) {
    console.error('Failed to create bucket:', error);
    throw error;
  }
};