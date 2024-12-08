import { z } from 'zod';

// Environment variable schema
const envSchema = z.object({
  // Storage Configuration
  STORAGE_TYPE: z.enum(['indexeddb', 'minio']).default('minio'),
  
  // MinIO Configuration
  MINIO_SERVER_URL: z.string().default('https://console-gaiawebinar-minio.ay09i1.easypanel.host'),
  MINIO_ACCESS_KEY: z.string().default('OB2A4cEyCYMBcKIjThk3'),
  MINIO_SECRET_KEY: z.string().default('x78cFIha5G0IGfrEoyUX7WVyMv8GBPRUkbRnbI6I'),
  MINIO_BUCKET_NAME: z.string().default('webinar-videos'),
  MINIO_PORT: z.number().default(443),
  MINIO_USE_SSL: z.boolean().default(true),
  MINIO_API_VERSION: z.string().default('s3v4'),
  
  // Video Configuration
  MAX_VIDEO_SIZE_MB: z.number().default(500),
  ALLOWED_VIDEO_TYPES: z.array(z.string()).default(['video/mp4', 'video/webm']),
  
  // Chunk Configuration for IndexedDB
  CHUNK_SIZE_MB: z.number().default(1),
  
  // API Configuration
  API_BASE_URL: z.string().default('http://localhost:3000'),
  API_TIMEOUT_MS: z.number().default(30000),
  
  // Feature Flags
  ENABLE_VIDEO_PREVIEW: z.boolean().default(true),
  ENABLE_CHUNK_UPLOAD: z.boolean().default(true),
  ENABLE_COMPRESSION: z.boolean().default(false),
});

// Environment variables with defaults
const envDefaults = {
  STORAGE_TYPE: 'minio',
  MINIO_SERVER_URL: 'https://console-gaiawebinar-minio.ay09i1.easypanel.host',
  MINIO_ACCESS_KEY: 'OB2A4cEyCYMBcKIjThk3',
  MINIO_SECRET_KEY: 'x78cFIha5G0IGfrEoyUX7WVyMv8GBPRUkbRnbI6I',
  MINIO_BUCKET_NAME: 'webinar-videos',
  MINIO_PORT: 443,
  MINIO_USE_SSL: true,
  MINIO_API_VERSION: 's3v4',
  MAX_VIDEO_SIZE_MB: 500,
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
  CHUNK_SIZE_MB: 1,
  API_BASE_URL: 'http://localhost:3000',
  API_TIMEOUT_MS: 30000,
  ENABLE_VIDEO_PREVIEW: true,
  ENABLE_CHUNK_UPLOAD: true,
  ENABLE_COMPRESSION: false,
};

// Load environment variables from import.meta.env or process.env
const loadEnvVariables = () => {
  const env = import.meta.env || process.env;
  return {
    ...envDefaults,
    MINIO_SERVER_URL: env.VITE_MINIO_SERVER_URL || envDefaults.MINIO_SERVER_URL,
    MINIO_ACCESS_KEY: env.VITE_MINIO_ACCESS_KEY || envDefaults.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: env.VITE_MINIO_SECRET_KEY || envDefaults.MINIO_SECRET_KEY,
    MINIO_BUCKET_NAME: env.VITE_MINIO_BUCKET_NAME || envDefaults.MINIO_BUCKET_NAME,
    MINIO_PORT: Number(env.VITE_MINIO_PORT) || envDefaults.MINIO_PORT,
    MINIO_USE_SSL: env.VITE_MINIO_USE_SSL === 'true' || envDefaults.MINIO_USE_SSL,
    MINIO_API_VERSION: env.VITE_MINIO_API_VERSION || envDefaults.MINIO_API_VERSION,
  };
};

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(loadEnvVariables());
  } catch (error) {
    console.error('Environment validation error:', error);
    return envDefaults;
  }
};

// Export typed environment configuration
export const env = parseEnv();

// Type for the environment configuration
export type Environment = z.infer<typeof envSchema>;

// Helper functions
export const isMinioEnabled = () => env.STORAGE_TYPE === 'minio';
export const getChunkSize = () => env.CHUNK_SIZE_MB * 1024 * 1024;
export const getMaxVideoSize = () => env.MAX_VIDEO_SIZE_MB * 1024 * 1024;
export const isVideoTypeAllowed = (type: string) => env.ALLOWED_VIDEO_TYPES.includes(type);

// Storage configuration type
export interface StorageConfig {
  type: 'indexeddb' | 'minio';
  minio?: {
    serverUrl: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
    bucketName: string;
    apiVersion: string;
  };
}

// Get storage configuration
export const getStorageConfig = (): StorageConfig => ({
  type: env.STORAGE_TYPE,
  ...(env.STORAGE_TYPE === 'minio' && {
    minio: {
      serverUrl: env.MINIO_SERVER_URL,
      port: env.MINIO_PORT,
      useSSL: env.MINIO_USE_SSL,
      accessKey: env.MINIO_ACCESS_KEY,
      secretKey: env.MINIO_SECRET_KEY,
      bucketName: env.MINIO_BUCKET_NAME,
      apiVersion: env.MINIO_API_VERSION,
    },
  }),
});