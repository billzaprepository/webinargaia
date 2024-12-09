export interface VideoMetadata {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  uploadDate: Date;
  url: string;
}

export interface StorageError extends Error {
  code?: string;
  $metadata?: {
    httpStatusCode?: number;
    requestId?: string;
    attempts?: number;
  };
}