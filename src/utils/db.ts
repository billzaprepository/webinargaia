import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'webinar-gaia-db';
const VIDEO_STORE = 'videos';
const VERSION = 1;

interface VideoRecord {
  id: string;
  file: File;
  timestamp: number;
  metadata?: {
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

  async saveVideo(id: string, file: File): Promise<void> {
    const db = await this.db;
    const record: VideoRecord = {
      id,
      file,
      timestamp: Date.now(),
      metadata: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }
    };
    await db.put(VIDEO_STORE, record);
  }

  async getVideo(id: string): Promise<File | null> {
    const db = await this.db;
    const record = await db.get(VIDEO_STORE, id);
    return record ? record.file : null;
  }

  async deleteVideo(id: string): Promise<void> {
    const db = await this.db;
    await db.delete(VIDEO_STORE, id);
  }

  async getAllVideos(): Promise<VideoRecord[]> {
    const db = await this.db;
    return db.getAll(VIDEO_STORE);
  }

  async clearAll(): Promise<void> {
    const db = await this.db;
    await db.clear(VIDEO_STORE);
  }

  async getVideoMetadata(id: string): Promise<VideoRecord['metadata'] | null> {
    const db = await this.db;
    const record = await db.get(VIDEO_STORE, id);
    return record?.metadata || null;
  }

  async updateMetadata(id: string, metadata: Partial<VideoRecord['metadata']>): Promise<void> {
    const db = await this.db;
    const record = await db.get(VIDEO_STORE, id);
    if (record) {
      record.metadata = { ...record.metadata, ...metadata };
      await db.put(VIDEO_STORE, record);
    }
  }

  async getStorageUsage(): Promise<number> {
    const videos = await this.getAllVideos();
    return videos.reduce((total, record) => total + record.file.size, 0);
  }
}

export const videoDB = new VideoDB();