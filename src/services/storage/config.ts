import { z } from 'zod';

export const storageConfigSchema = z.object({
  endpoint: z.string(),
  accessKey: z.string(),
  secretKey: z.string(),
  bucket: z.string(),
  useSSL: z.boolean(),
  region: z.string().default('ash-dc1'),
  port: z.number().optional(),
  consoleEndpoint: z.string().optional(),
  consolePort: z.number().optional()
});

export type StorageConfig = z.infer<typeof storageConfigSchema>;

export const defaultStorageConfig: StorageConfig = {
  endpoint: 'gaiawebinar-minio.ay09i1.easypanel.host',
  accessKey: 'OB2A4cEyCYMBcKIjThk3',
  secretKey: 'x78cFIha5G0IGfrEoyUX7WVyMv8GBPRUkbRnbI6I',
  bucket: 'webinar-videos',
  useSSL: true,
  region: 'ash-dc1',
  port: 9000,
  consoleEndpoint: 'console-gaiawebinar-minio.ay09i1.easypanel.host',
  consolePort: 9001
};

export const validateStorageConfig = (config: unknown): StorageConfig => {
  const validated = storageConfigSchema.parse(config);
  if (!validated.region) {
    validated.region = 'ash-dc1';
  }
  return validated;
};