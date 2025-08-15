/**
 * Sistema de Armazenamento Offline - IndexedDB
 * Clínica Bem Cuidar
 * 
 * Gerencia dados offline para PWA, incluindo:
 * - Formulários de agendamento
 * - Dados de contacto
 * - Configurações do usuário
 * - Cache de dados da API
 * - Logs de consentimento
 */

// Configuração do banco de dados
const DB_NAME = 'BemCuidarDB';
const DB_VERSION = 1;

// Stores (tabelas)
const STORES = {
  APPOINTMENTS: 'appointments',
  CONTACTS: 'contacts',
  SETTINGS: 'settings',
  API_CACHE: 'api_cache',
  CONSENT_LOGS: 'consent_logs',
  SYNC_QUEUE: 'sync_queue',
} as const;

// Tipos
export interface OfflineAppointment {
  id: string;
  timestamp: number;
  data: any;
  status: 'pending' | 'syncing' | 'synced' | 'error';
  retryCount: number;
  lastRetry?: number;
  error?: string;
}

export interface OfflineContact {
  id: string;
  timestamp: number;
  data: any;
  status: 'pending' | 'syncing' | 'synced' | 'error';
  retryCount: number;
}

export interface APICache {
  key: string;
  data: any;
  timestamp: number;
  expires: number;
}

export interface ConsentLog {
  id: string;
  timestamp: number;
  settings: any;
  version: string;
  ipAddress: string;
  userAgent: string;
  synced: boolean;
}

export interface SyncQueueItem {
  id: string;
  type: 'appointment' | 'contact' | 'consent';
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  data: any;
  timestamp: number;
  retryCount: number;
  nextRetry: number;
  priority: 'high' | 'medium' | 'low';
}

class OfflineStorage {
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    this.init();
  }

  /**
   * Inicializar banco de dados
   */
  private async init(): Promise<void> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createStores(db);
      };
    });

    return this.dbPromise;
  }

  /**
   * Criar stores (tabelas) do banco
   */
  private createStores(db: IDBDatabase): void {
    // Store para agendamentos offline
    if (!db.objectStoreNames.contains(STORES.APPOINTMENTS)) {
      const appointmentStore = db.createObjectStore(STORES.APPOINTMENTS, { keyPath: 'id' });
      appointmentStore.createIndex('timestamp', 'timestamp');
      appointmentStore.createIndex('status', 'status');
    }

    // Store para contactos offline
    if (!db.objectStoreNames.contains(STORES.CONTACTS)) {
      const contactStore = db.createObjectStore(STORES.CONTACTS, { keyPath: 'id' });
      contactStore.createIndex('timestamp', 'timestamp');
      contactStore.createIndex('status', 'status');
    }

    // Store para configurações
    if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
      db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
    }

    // Store para cache da API
    if (!db.objectStoreNames.contains(STORES.API_CACHE)) {
      const cacheStore = db.createObjectStore(STORES.API_CACHE, { keyPath: 'key' });
      cacheStore.createIndex('timestamp', 'timestamp');
      cacheStore.createIndex('expires', 'expires');
    }

    // Store para logs de consentimento
    if (!db.objectStoreNames.contains(STORES.CONSENT_LOGS)) {
      const consentStore = db.createObjectStore(STORES.CONSENT_LOGS, { keyPath: 'id' });
      consentStore.createIndex('timestamp', 'timestamp');
      consentStore.createIndex('synced', 'synced');
    }

    // Store para fila de sincronização
    if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
      const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id' });
      syncStore.createIndex('timestamp', 'timestamp');
      syncStore.createIndex('nextRetry', 'nextRetry');
      syncStore.createIndex('priority', 'priority');
    }
  }

  /**
   * Obter instância do banco
   */
  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return this.init();
  }

  /**
   * Salvar agendamento offline
   */
  async saveAppointment(data: any): Promise<string> {
    const db = await this.getDB();
    const id = `appointment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const appointment: OfflineAppointment = {
      id,
      timestamp: Date.now(),
      data,
      status: 'pending',
      retryCount: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.APPOINTMENTS], 'readwrite');
      const store = transaction.objectStore(STORES.APPOINTMENTS);
      const request = store.add(appointment);

      request.onsuccess = () => {
        // Adicionar à fila de sincronização
        this.addToSyncQueue({
          id: `sync_${id}`,
          type: 'appointment',
          endpoint: '/api/agendamento',
          method: 'POST',
          data,
          timestamp: Date.now(),
          retryCount: 0,
          nextRetry: Date.now(),
          priority: 'high'
        });
        resolve(id);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Salvar contacto offline
   */
  async saveContact(data: any): Promise<string> {
    const db = await this.getDB();
    const id = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const contact: OfflineContact = {
      id,
      timestamp: Date.now(),
      data,
      status: 'pending',
      retryCount: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.CONTACTS], 'readwrite');
      const store = transaction.objectStore(STORES.CONTACTS);
      const request = store.add(contact);

      request.onsuccess = () => {
        this.addToSyncQueue({
          id: `sync_${id}`,
          type: 'contact',
          endpoint: '/api/contacto',
          method: 'POST',
          data,
          timestamp: Date.now(),
          retryCount: 0,
          nextRetry: Date.now(),
          priority: 'medium'
        });
        resolve(id);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Salvar log de consentimento
   */
  async saveConsentLog(settings: any, version: string): Promise<string> {
    const db = await this.getDB();
    const id = `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const log: ConsentLog = {
      id,
      timestamp: Date.now(),
      settings,
      version,
      ipAddress: 'hidden', // Será preenchido no backend
      userAgent: navigator.userAgent,
      synced: false,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.CONSENT_LOGS], 'readwrite');
      const store = transaction.objectStore(STORES.CONSENT_LOGS);
      const request = store.add(log);

      request.onsuccess = () => {
        this.addToSyncQueue({
          id: `sync_${id}`,
          type: 'consent',
          endpoint: '/api/consent-log',
          method: 'POST',
          data: log,
          timestamp: Date.now(),
          retryCount: 0,
          nextRetry: Date.now(),
          priority: 'low'
        });
        resolve(id);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Adicionar item à fila de sincronização
   */
  private async addToSyncQueue(item: SyncQueueItem): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      const request = store.add(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Obter itens pendentes de sincronização
   */
  async getPendingSyncItems(): Promise<SyncQueueItem[]> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.SYNC_QUEUE], 'readonly');
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      const index = store.index('nextRetry');
      const request = index.getAll(IDBKeyRange.upperBound(Date.now()));

      request.onsuccess = () => {
        const items = request.result.sort((a, b) => {
          // Priorizar por urgência e depois por tempo
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }
          return a.timestamp - b.timestamp;
        });
        resolve(items);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Sincronizar item com servidor
   */
  async syncItem(item: SyncQueueItem): Promise<boolean> {
    try {
      const response = await fetch(item.endpoint, {
        method: item.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.data),
      });

      if (response.ok) {
        // Remover da fila de sincronização
        await this.removeFromSyncQueue(item.id);
        
        // Marcar como sincronizado no store original
        await this.markAsSynced(item);
        
        console.log(`[OfflineStorage] Synced ${item.type} successfully:`, item.id);
        return true;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error(`[OfflineStorage] Sync failed for ${item.id}:`, error);
      
      // Incrementar contador de tentativas
      await this.incrementRetryCount(item);
      return false;
    }
  }

  /**
   * Remover item da fila de sincronização
   */
  private async removeFromSyncQueue(id: string): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Marcar item como sincronizado
   */
  private async markAsSynced(item: SyncQueueItem): Promise<void> {
    const db = await this.getDB();
    
    const storeMap = {
      appointment: STORES.APPOINTMENTS,
      contact: STORES.CONTACTS,
      consent: STORES.CONSENT_LOGS,
    };

    const storeName = storeMap[item.type];
    if (!storeName) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // Extrair ID original do item
      const originalId = item.id.replace('sync_', '');
      const getRequest = store.get(originalId);

      getRequest.onsuccess = () => {
        const record = getRequest.result;
        if (record) {
          if (item.type === 'consent') {
            record.synced = true;
          } else {
            record.status = 'synced';
          }
          
          const putRequest = store.put(record);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve(); // Item não encontrado, assumir como removido
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Incrementar contador de tentativas
   */
  private async incrementRetryCount(item: SyncQueueItem): Promise<void> {
    const db = await this.getDB();
    
    const maxRetries = 5;
    const retryDelay = Math.min(1000 * Math.pow(2, item.retryCount), 300000); // Backoff exponencial, máx 5min

    if (item.retryCount >= maxRetries) {
      // Remover da fila após muitas tentativas
      await this.removeFromSyncQueue(item.id);
      console.error(`[OfflineStorage] Max retries reached for ${item.id}`);
      return;
    }

    const updatedItem = {
      ...item,
      retryCount: item.retryCount + 1,
      nextRetry: Date.now() + retryDelay,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      const request = store.put(updatedItem);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Cache de dados da API
   */
  async cacheAPIData(key: string, data: any, ttlMinutes: number = 30): Promise<void> {
    const db = await this.getDB();
    
    const cacheItem: APICache = {
      key,
      data,
      timestamp: Date.now(),
      expires: Date.now() + (ttlMinutes * 60 * 1000),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.API_CACHE], 'readwrite');
      const store = transaction.objectStore(STORES.API_CACHE);
      const request = store.put(cacheItem);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Obter dados do cache
   */
  async getCachedData(key: string): Promise<any | null> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.API_CACHE], 'readonly');
      const store = transaction.objectStore(STORES.API_CACHE);
      const request = store.get(key);

      request.onsuccess = () => {
        const item = request.result;
        if (item && item.expires > Date.now()) {
          resolve(item.data);
        } else {
          if (item) {
            // Remover item expirado
            this.removeCachedData(key);
          }
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Remover dados do cache
   */
  async removeCachedData(key: string): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.API_CACHE], 'readwrite');
      const store = transaction.objectStore(STORES.API_CACHE);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Limpar dados expirados
   */
  async cleanExpiredData(): Promise<void> {
    const db = await this.getDB();
    const now = Date.now();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.API_CACHE], 'readwrite');
      const store = transaction.objectStore(STORES.API_CACHE);
      const index = store.index('expires');
      const request = index.openCursor(IDBKeyRange.upperBound(now));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Obter estatísticas de armazenamento
   */
  async getStorageStats(): Promise<{
    appointments: number;
    contacts: number;
    syncQueue: number;
    cacheSize: number;
  }> {
    const db = await this.getDB();
    
    const stats = {
      appointments: 0,
      contacts: 0,
      syncQueue: 0,
      cacheSize: 0,
    };

    const stores = [STORES.APPOINTMENTS, STORES.CONTACTS, STORES.SYNC_QUEUE, STORES.API_CACHE];
    const promises = stores.map(storeName => {
      return new Promise<number>((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.count();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });

    const results = await Promise.all(promises);
    
    stats.appointments = results[0];
    stats.contacts = results[1];
    stats.syncQueue = results[2];
    stats.cacheSize = results[3];

    return stats;
  }

  /**
   * Executar sincronização automática
   */
  async runAutoSync(): Promise<void> {
    if (!navigator.onLine) {
      console.log('[OfflineStorage] Offline, skipping sync');
      return;
    }

    const pendingItems = await this.getPendingSyncItems();
    console.log(`[OfflineStorage] Found ${pendingItems.length} items to sync`);

    for (const item of pendingItems) {
      await this.syncItem(item);
      // Pequeno delay entre sincronizações para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Limpar dados expirados
    await this.cleanExpiredData();
  }
}

// Instância singleton
export const offlineStorage = new OfflineStorage();

// Configurar sincronização automática
if (typeof window !== 'undefined') {
  // Sync quando voltar online
  window.addEventListener('online', () => {
    console.log('[OfflineStorage] Back online, running sync');
    offlineStorage.runAutoSync();
  });

  // Sync periódico (a cada 5 minutos se online)
  setInterval(() => {
    if (navigator.onLine) {
      offlineStorage.runAutoSync();
    }
  }, 5 * 60 * 1000);

  // Sync quando a página está prestes a ser fechada
  window.addEventListener('beforeunload', () => {
    if (navigator.onLine) {
      offlineStorage.runAutoSync();
    }
  });
}

export default offlineStorage;
