"use client"

// IndexedDB utility for complex data storage
class IndexedDBManager {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null = null;

  constructor(dbName: string = 'SmartWasteDB', version: number = 1) {
    this.dbName = dbName;
    this.version = version;
  }

  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('stats')) {
          db.createObjectStore('stats', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('containers')) {
          db.createObjectStore('containers', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sensors')) {
          db.createObjectStore('sensors', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('routes')) {
          db.createObjectStore('routes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('collectionLogs')) {
          db.createObjectStore('collectionLogs', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  async get<T>(storeName: string, key: string | number): Promise<T | null> {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async put<T>(storeName: string, value: T, key?: string | number): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = key ? store.put(value, key) : store.put(value);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, key: string | number): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDB = new IndexedDBManager();

// Convenience functions
export const dbUtils = {
  // User data
  saveUser: (user: { id: number; email: string; name: string; role: string }) => indexedDB.put('users', user, user.id),
  getUser: (id: number) => indexedDB.get<{ id: number; email: string; name: string; role: string }>('users', id),
  getAllUsers: () => indexedDB.getAll<{ id: number; email: string; name: string; role: string }>('users'),

  // Stats
  saveStats: (stats: { timeRange: string; timestamp: number; [key: string]: unknown }) => indexedDB.put('stats', stats, 'main'),
  getStats: () => indexedDB.get<{ timeRange: string; timestamp: number; [key: string]: unknown }>('stats', 'main'),

  // Containers
  saveContainer: (container: { id: number; location: string; routeId: number | null; status: string }) => indexedDB.put('containers', container, container.id),
  getContainer: (id: number) => indexedDB.get<{ id: number; location: string; routeId: number | null; status: string }>('containers', id),
  getAllContainers: () => indexedDB.getAll<{ id: number; location: string; routeId: number | null; status: string }>('containers'),

  // Sensors
  saveSensor: (sensor: { id: number; type: string; description: string; status: string; containerId: number | null }) => indexedDB.put('sensors', sensor, sensor.id),
  getSensor: (id: number) => indexedDB.get<{ id: number; type: string; description: string; status: string; containerId: number | null }>('sensors', id),
  getAllSensors: () => indexedDB.getAll<{ id: number; type: string; description: string; status: string; containerId: number | null }>('sensors'),

  // Routes
  saveRoute: (route: { id: number; name: string; status: string }) => indexedDB.put('routes', route, route.id),
  getRoute: (id: number) => indexedDB.get<{ id: number; name: string; status: string }>('routes', id),
  getAllRoutes: () => indexedDB.getAll<{ id: number; name: string; status: string }>('routes'),

  // Collection Logs
  saveCollectionLog: (log: { id?: number; [key: string]: unknown }) => indexedDB.put('collectionLogs', log),
  getAllCollectionLogs: () => indexedDB.getAll<{ id?: number; [key: string]: unknown }>('collectionLogs'),
  deleteCollectionLog: (id: number) => indexedDB.delete('collectionLogs', id),
};