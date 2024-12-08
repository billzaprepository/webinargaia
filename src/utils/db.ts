import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'webinar-gaia-db';
const VIDEO_STORE = 'videos';
const VERSION = 1;
const MAX_CHUNK_SIZE = 1024 * 1024; // 1MB chunks

interface VideoRecord {
  id: string;
  chunks: Blob[];
  totalChunks: number;
  timestamp: number;
  metadata: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  };
}

class VideoDB {
  private db: Promise<IDBPDatabase>;

  constructor() {
    this.db = this.initDB();
  }

  private async initDB() {
    return openDB(DB_NAME, VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(VIDEO_STORE)) {
          db.createObjectStore(VIDEO_STORE, { keyPath: 'id' });
        }
      },
    });
  }

  private async splitFileIntoChunks(file: File): Promise<Blob[]> {
    const chunks: Blob[] = [];
    let start = 0;
    
    while (start < file.size) {
      const end = Math.min(start + MAX_CHUNK_SIZE, file.size);
      chunks.push(file.slice(start, end));
      start = end;
    }
    
    return chunks;
  }

  private async assembleChunks(chunks: Blob[]): Promise<File> {
    const blob = new Blob(chunks);
    return new File([blob], 'video', { type: 'video/mp4' });
  }

  async saveVideo(id: string, file: File): Promise<void> {
    try {
      const db = await this.db;
      const chunks = await this.splitFileIntoChunks(file);
      
      const record: VideoRecord = {
        id,
        chunks,
        totalChunks: chunks.length,
        timestamp: Date.now(),
        metadata: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        }
      };

      await db.put(VIDEO_STORE, record);
      console.log(`Video saved successfully: ${id}`);
    } catch (error) {
      console.error('Error saving video:', error);
      throw new Error('Failed to save video');
    }
  }

  async getVideo(id: string): Promise<File | null> {
    try {
      const db = await this.db;
      const record = await db.get(VIDEO_STORE, id);
      
      if (!record) {
        console.log(`Video not found: ${id}`);
        return null;
      }

      const file = await this.assembleChunks(record.chunks);
      return file;
    } catch (error) {
      console.error('Error retrieving video:', error);
      return null;
    }
  }

  async deleteVideo(id: string): Promise<void> {
    try {
      const db = await this.db;
      await db.delete(VIDEO_STORE, id);
      console.log(`Video deleted successfully: ${id}`);
    } catch (error) {
      console.error('Error deleting video:', error);
      throw new Error('Failed to delete video');
    }
  }

  async getAllVideos(): Promise<VideoRecord[]> {
    try {
      const db = await this.db;
      const records = await db.getAll(VIDEO_STORE);
      return records;
    } catch (error) {
      console.error('Error retrieving all videos:', error);
      return [];
    }
  }

  async clearAll(): Promise<void> {
    try {
      const db = await this.db;
      await db.clear(VIDEO_STORE);
      console.log('All videos cleared successfully');
    } catch (error) {
      console.error('Error clearing videos:', error);
      throw new Error('Failed to clear videos');
    }
  }

  async getVideoMetadata(id: string): Promise<VideoRecord['metadata'] | null> {
    try {
      const db = await this.db;
      const record = await db.get(VIDEO_STORE, id);
      return record?.metadata || null;
    } catch (error) {
      console.error('Error retrieving video metadata:', error);
      return null;
    }
  }

  async updateMetadata(id: string, metadata: Partial<VideoRecord['metadata']>): Promise<void> {
    try {
      const db = await this.db;
      const record = await db.get(VIDEO_STORE, id);
      if (record) {
        record.metadata = { ...record.metadata, ...metadata };
        await db.put(VIDEO_STORE, record);
        console.log(`Metadata updated successfully: ${id}`);
      }
    } catch (error) {
      console.error('Error updating metadata:', error);
      throw new Error('Failed to update metadata');
    }
  }

  async getStorageUsage(): Promise<number> {
    try {
      const videos = await this.getAllVideos();
      return videos.reduce((total, record) => total + record.metadata.size, 0);
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return 0;
    }
  }

  async isStorageAvailable(): Promise<boolean> {
    try {
      const db = await this.db;
      const testKey = 'storage-test';
      await db.put(VIDEO_STORE, { id: testKey, chunks: [] });
      await db.delete(VIDEO_STORE, testKey);
      return true;
    } catch (error) {
      console.error('Storage not available:', error);
      return false;
    }
  }
}

export const videoDB = new VideoDB();