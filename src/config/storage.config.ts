import { z } from 'zod';

const storageConfigSchema = z.object({
  endpoint: z.string(),
  accessKey: z.string(),
  secretKey: z.string(),
  bucket: z.string(),
  useSSL: z.boolean(),
  region: z.string().default('us-east-1'),
  port: z.number().optional()
});

export type StorageConfig = z.infer<typeof storageConfigSchema>;

export const storageConfig: StorageConfig = {
  endpoint: 'gaiawebinar-minio.ay09i1.easypanel.host',
  accessKey: 'OB2A4cEyCYMBcKIjThk3',
  secretKey: 'x78cFIha5G0IGfrEoyUX7WVyMv8GBPRUkbRnbI6I',
  bucket: 'webinar-videos',
  useSSL: true,
  region: 'us-east-1',
  port: 9000
};