import { z } from 'zod';

// Environment variable schema
const envSchema = z.object({
  // Storage Configuration
  STORAGE_TYPE: z.enum(['indexeddb', 'minio']).default('minio'),
  
  // MinIO Configuration
  MINIO_SERVER_URL: z.string().default('https://gaiawebinar-minio.sy9511.easypanel.host'),
  MINIO_ROOT_USER: z.string().default('minio'),
  MINIO_ROOT_PASSWORD: z.string().default('d6442690'),
  MINIO_BUCKET_NAME: z.string().default('webinar-videos'),
  MINIO_PORT: z.number().default(443),
  MINIO_USE_SSL: z.boolean().default(true),
  
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

// Load environment variables from import.meta.env or process.env
const loadEnvVariables = () => {
  const env = import.meta.env || process.env;
  return {
    ...envDefaults,
    MINIO_SERVER_URL: env.VITE_MINIO_SERVER_URL || envDefaults.MINIO_SERVER_URL,
    MINIO_ROOT_USER: env.VITE_MINIO_ROOT_USER || envDefaults.MINIO_ROOT_USER,
    MINIO_ROOT_PASSWORD: env.VITE_MINIO_ROOT_PASSWORD || envDefaults.MINIO_ROOT_PASSWORD,
    MINIO_BUCKET_NAME: env.VITE_MINIO_BUCKET_NAME || envDefaults.MINIO_BUCKET_NAME,
    MINIO_PORT: Number(env.VITE_MINIO_PORT) || envDefaults.MINIO_PORT,
    MINIO_USE_SSL: env.VITE_MINIO_USE_SSL === 'true' || envDefaults.MINIO_USE_SSL,
  };
};

// Environment variables with defaults
const envDefaults = {
  STORAGE_TYPE: 'minio',
  MINIO_SERVER_URL: 'https://gaiawebinar-minio.sy9511.easypanel.host',
  MINIO_ROOT_USER: 'minio',
  MINIO_ROOT_PASSWORD: 'd6442690',
  MINIO_BUCKET_NAME: 'webinar-videos',
  MINIO_PORT: 443,
  MINIO_USE_SSL: true,
  MAX_VIDEO_SIZE_MB: 500,
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
  CHUNK_SIZE_MB: 1,
  API_BASE_URL: 'http://localhost:3000',
  API_TIMEOUT_MS: 30000,
  ENABLE_VIDEO_PREVIEW: true,
  ENABLE_CHUNK_UPLOAD: true,
  ENABLE_COMPRESSION: false,
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
    rootUser: string;
    rootPassword: string;
    bucketName: string;
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
      rootUser: env.MINIO_ROOT_USER,
      rootPassword: env.MINIO_ROOT_PASSWORD,
      bucketName: env.MINIO_BUCKET_NAME,
    },
  }),
});