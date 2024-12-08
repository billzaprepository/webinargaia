import { z } from 'zod';

// Environment variable schema
const envSchema = z.object({
  // Storage Configuration
  STORAGE_TYPE: z.enum(['indexeddb', 'minio']).default('indexeddb'),
  
  // MinIO Configuration (when STORAGE_TYPE is 'minio')
  MINIO_ENDPOINT: z.string().default('localhost'),
  MINIO_PORT: z.number().default(9000),
  MINIO_USE_SSL: z.boolean().default(false),
  MINIO_ACCESS_KEY: z.string().default('minioadmin'),
  MINIO_SECRET_KEY: z.string().default('minioadmin'),
  MINIO_BUCKET_NAME: z.string().default('webinar-videos'),
  
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
  STORAGE_TYPE: 'indexeddb',
  MINIO_ENDPOINT: 'localhost',
  MINIO_PORT: 9000,
  MINIO_USE_SSL: false,
  MINIO_ACCESS_KEY: 'minioadmin',
  MINIO_SECRET_KEY: 'minioadmin',
  MINIO_BUCKET_NAME: 'webinar-videos',
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
    ...Object.fromEntries(
      Object.entries(env).filter(([key]) => key.startsWith('VITE_'))
        .map(([key, value]) => [key.replace('VITE_', ''), value])
    )
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
    endpoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
    bucketName: string;
  };
}

// Get storage configuration
export const getStorageConfig = (): StorageConfig => ({
  type: env.STORAGE_TYPE,
  ...(env.STORAGE_TYPE === 'minio' && {
    minio: {
      endpoint: env.MINIO_ENDPOINT,
      port: env.MINIO_PORT,
      useSSL: env.MINIO_USE_SSL,
      accessKey: env.MINIO_ACCESS_KEY,
      secretKey: env.MINIO_SECRET_KEY,
      bucketName: env.MINIO_BUCKET_NAME,
    },
  }),
});