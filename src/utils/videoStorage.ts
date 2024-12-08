import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'webinar-storage';
const VIDEO_STORE = 'videos';
const VERSION = 1;

interface VideoRecord {
  id: string;
  file: File;
  timestamp: number;
}

class VideoStorage {
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
}

export const videoStorage = new VideoStorage();