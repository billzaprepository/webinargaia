import { z } from 'zod';

const envSchema = z.object({
  STORAGE_URL: z.string().default('https://gaiawebinar-minio.ay09i1.easypanel.host'),
  STORAGE_PORT: z.number().default(9000),
  STORAGE_ACCESS_KEY: z.string().default('OB2A4cEyCYMBcKIjThk3'),
  STORAGE_SECRET_KEY: z.string().default('x78cFIha5G0IGfrEoyUX7WVyMv8GBPRUkbRnbI6I'),
  STORAGE_BUCKET: z.string().default('webinar-videos'),
  STORAGE_REGION: z.string().default('us-east-1'),
  STORAGE_USE_SSL: z.boolean().default(true)
});

export const env = envSchema.parse({
  STORAGE_URL: 'https://gaiawebinar-minio.ay09i1.easypanel.host',
  STORAGE_PORT: 9000,
  STORAGE_ACCESS_KEY: 'OB2A4cEyCYMBcKIjThk3',
  STORAGE_SECRET_KEY: 'x78cFIha5G0IGfrEoyUX7WVyMv8GBPRUkbRnbI6I',
  STORAGE_BUCKET: 'webinar-videos',
  STORAGE_REGION: 'us-east-1',
  STORAGE_USE_SSL: true
});

export type Environment = z.infer<typeof envSchema>;