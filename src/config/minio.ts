import { Client } from 'minio';
import { env } from './environment';

// Configuração do cliente MinIO
export const minioClient = new Client({
  endPoint: new URL(env.MINIO_SERVER_URL).hostname,
  port: env.MINIO_PORT,
  useSSL: env.MINIO_USE_SSL,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
  pathStyle: true, // Necessário para alguns provedores S3-compatible
  region: 'us-east-1', // Região padrão
  transport: {
    // Configurações adicionais de segurança
    agent: undefined,
    trustSelfSigned: true
  }
});

// Nome do bucket para armazenamento dos vídeos
export const VIDEOS_BUCKET = env.MINIO_BUCKET_NAME;

// Inicializa o bucket se não existir
export const initializeBucket = async () => {
  try {
    const bucketExists = await minioClient.bucketExists(VIDEOS_BUCKET);
    if (!bucketExists) {
      await minioClient.makeBucket(VIDEOS_BUCKET, 'us-east-1');
      console.log(`Bucket ${VIDEOS_BUCKET} created successfully`);
      
      // Configura política de acesso público para o bucket
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${VIDEOS_BUCKET}/*`]
          }
        ]
      };
      
      await minioClient.setBucketPolicy(VIDEOS_BUCKET, JSON.stringify(policy));
    }
  } catch (error) {
    console.error('Error initializing MinIO bucket:', error);
    throw error;
  }
};

// Função para gerar URL pré-assinada para upload
export const getUploadUrl = async (fileName: string) => {
  try {
    return await minioClient.presignedPutObject(VIDEOS_BUCKET, fileName, 24 * 60 * 60); // 24 horas
  } catch (error) {
    console.error('Error generating upload URL:', error);
    throw error;
  }
};

// Função para gerar URL pré-assinada para download/visualização
export const getViewUrl = async (fileName: string) => {
  try {
    return await minioClient.presignedGetObject(VIDEOS_BUCKET, fileName, 24 * 60 * 60); // 24 horas
  } catch (error) {
    console.error('Error generating view URL:', error);
    throw error;
  }
};

// Inicializa o bucket ao importar o módulo
initializeBucket().catch(console.error);