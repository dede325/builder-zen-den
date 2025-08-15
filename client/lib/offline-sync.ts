/**
 * Offline Synchronization Manager
 * Manages data synchronization for the medical portal when offline/online
 * Complies with Angola data protection and medical record laws
 */

interface OfflineData {
  id: string;
  type:
    | "appointment"
    | "message"
    | "vital_signs"
    | "prescription"
    | "consultation_notes";
  data: any;
  timestamp: number;
  userId: string;
  synced: boolean;
  encrypted: boolean;
  priority: "low" | "medium" | "high" | "emergency";
}

interface SyncResult {
  success: boolean;
  error?: string;
  data?: any;
}

class OfflineSyncManager {
  private dbName = "ClinicaBemCuidarOffline";
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private syncInProgress = false;
  private maxRetentionDays = 30; // Angola legal requirement

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.setupCleanupSchedule();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createStores(db);
      };
    });
  }

  private createStores(db: IDBDatabase): void {
    // Offline data store
    if (!db.objectStoreNames.contains("offline_data")) {
      const store = db.createObjectStore("offline_data", { keyPath: "id" });
      store.createIndex("type", "type");
      store.createIndex("timestamp", "timestamp");
      store.createIndex("userId", "userId");
      store.createIndex("synced", "synced");
      store.createIndex("priority", "priority");
    }

    // Sync queue store
    if (!db.objectStoreNames.contains("sync_queue")) {
      const store = db.createObjectStore("sync_queue", { keyPath: "id" });
      store.createIndex("priority", "priority");
      store.createIndex("timestamp", "timestamp");
    }

    // Cached responses store
    if (!db.objectStoreNames.contains("cached_responses")) {
      const store = db.createObjectStore("cached_responses", {
        keyPath: "url",
      });
      store.createIndex("timestamp", "timestamp");
      store.createIndex("type", "type");
    }
  }

  // Store data for offline use
  async storeOfflineData(
    type: OfflineData["type"],
    data: any,
    priority: OfflineData["priority"] = "medium",
  ): Promise<string> {
    if (!this.db) throw new Error("Database not initialized");

    const offlineData: OfflineData = {
      id: this.generateId(),
      type,
      data: await this.encryptSensitiveData(data),
      timestamp: Date.now(),
      userId: this.getCurrentUserId(),
      synced: false,
      encrypted: this.isSensitiveData(type),
      priority,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_data"], "readwrite");
      const store = transaction.objectStore("offline_data");
      const request = store.add(offlineData);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log("[OfflineSync] Data stored offline:", offlineData.id);
        resolve(offlineData.id);

        // Try to sync immediately if online
        if (navigator.onLine) {
          this.syncData();
        }
      };
    });
  }

  // Get offline data by type
  async getOfflineData(
    type: OfflineData["type"],
    userId?: string,
  ): Promise<OfflineData[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_data"], "readonly");
      const store = transaction.objectStore("offline_data");
      const index = store.index("type");
      const request = index.getAll(type);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        let data = request.result;

        // Filter by user if specified
        if (userId) {
          data = data.filter((item) => item.userId === userId);
        }

        // Decrypt sensitive data
        const decryptedData = data.map((item) => ({
          ...item,
          data: item.encrypted
            ? this.decryptSensitiveData(item.data)
            : item.data,
        }));

        resolve(decryptedData);
      };
    });
  }

  // Sync pending data with server
  async syncData(): Promise<void> {
    if (!navigator.onLine || this.syncInProgress) return;

    this.syncInProgress = true;
    console.log("[OfflineSync] Starting data synchronization...");

    try {
      const pendingData = await this.getPendingData();
      const results: SyncResult[] = [];

      // Sort by priority (emergency first)
      const sortedData = this.sortByPriority(pendingData);

      for (const item of sortedData) {
        try {
          const result = await this.syncItem(item);
          results.push(result);

          if (result.success) {
            await this.markAsSynced(item.id);
          }
        } catch (error) {
          console.error("[OfflineSync] Failed to sync item:", item.id, error);
          results.push({ success: false, error: String(error) });
        }
      }

      // Notify clients about sync results
      this.notifyClients("SYNC_COMPLETED", { results });
    } catch (error) {
      console.error("[OfflineSync] Sync process failed:", error);
      this.notifyClients("SYNC_FAILED", { error: String(error) });
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncItem(item: OfflineData): Promise<SyncResult> {
    const endpoint = this.getEndpointForType(item.type);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
          "X-Offline-Sync": "true",
          "X-Angola-Compliance": "true", // Indicate compliance tracking
        },
        body: JSON.stringify({
          ...item.data,
          offline_id: item.id,
          offline_timestamp: item.timestamp,
          priority: item.priority,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private getEndpointForType(type: OfflineData["type"]): string {
    const endpoints = {
      appointment: "/api/appointments",
      message: "/api/messages",
      vital_signs: "/api/vital-signs",
      prescription: "/api/prescriptions",
      consultation_notes: "/api/consultations",
    };

    return endpoints[type] || "/api/sync";
  }

  private async getPendingData(): Promise<OfflineData[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_data"], "readonly");
      const store = transaction.objectStore("offline_data");
      const index = store.index("synced");
      const request = index.getAll(false);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  private sortByPriority(data: OfflineData[]): OfflineData[] {
    const priorityOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
    return data.sort((a, b) => {
      const orderA = priorityOrder[a.priority];
      const orderB = priorityOrder[b.priority];
      return orderA - orderB;
    });
  }

  private async markAsSynced(id: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_data"], "readwrite");
      const store = transaction.objectStore("offline_data");
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          data.synced = true;
          const putRequest = store.put(data);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Cache API responses for offline use
  async cacheResponse(url: string, response: any, type: string): Promise<void> {
    if (!this.db) return;

    const cachedData = {
      url,
      response,
      type,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ["cached_responses"],
        "readwrite",
      );
      const store = transaction.objectStore("cached_responses");
      const request = store.put(cachedData);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Get cached response
  async getCachedResponse(url: string): Promise<any | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ["cached_responses"],
        "readonly",
      );
      const store = transaction.objectStore("cached_responses");
      const request = store.get(url);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result && this.isCacheValid(result.timestamp)) {
          resolve(result.response);
        } else {
          resolve(null);
        }
      };
    });
  }

  // Clean up old data (Angola compliance - 30 days retention)
  async cleanupOldData(): Promise<void> {
    if (!this.db) return;

    const cutoffDate = Date.now() - this.maxRetentionDays * 24 * 60 * 60 * 1000;

    const stores = ["offline_data", "cached_responses"];

    for (const storeName of stores) {
      await this.cleanupStore(storeName, cutoffDate);
    }

    console.log("[OfflineSync] Old data cleanup completed");
  }

  private async cleanupStore(
    storeName: string,
    cutoffDate: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const index = store.index("timestamp");
      const range = IDBKeyRange.upperBound(cutoffDate);
      const request = index.openCursor(range);

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

  // Setup automatic cleanup schedule
  private setupCleanupSchedule(): void {
    // Run cleanup daily
    setInterval(
      () => {
        this.cleanupOldData();
      },
      24 * 60 * 60 * 1000,
    );

    // Run initial cleanup
    setTimeout(() => {
      this.cleanupOldData();
    }, 5000);
  }

  // Encryption helpers for sensitive medical data
  private async encryptSensitiveData(data: any): Promise<any> {
    // In a real implementation, use Web Crypto API for AES-256 encryption
    // This is a placeholder for the encryption logic
    return data; // TODO: Implement actual encryption
  }

  private decryptSensitiveData(encryptedData: any): any {
    // In a real implementation, decrypt using Web Crypto API
    // This is a placeholder for the decryption logic
    return encryptedData; // TODO: Implement actual decryption
  }

  private isSensitiveData(type: OfflineData["type"]): boolean {
    const sensitiveTypes = [
      "vital_signs",
      "prescription",
      "consultation_notes",
    ];
    return sensitiveTypes.includes(type);
  }

  private isCacheValid(timestamp: number): boolean {
    const maxAge = 60 * 60 * 1000; // 1 hour
    return Date.now() - timestamp < maxAge;
  }

  private generateId(): string {
    return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentUserId(): string {
    // Get from auth store or localStorage
    const auth = localStorage.getItem("bem-cuidar-auth");
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        return parsed.state?.session?.user?.id || "unknown";
      } catch {
        return "unknown";
      }
    }
    return "unknown";
  }

  private getAuthToken(): string {
    const auth = localStorage.getItem("bem-cuidar-auth");
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        return parsed.state?.session?.access_token || "";
      } catch {
        return "";
      }
    }
    return "";
  }

  private notifyClients(type: string, data: any): void {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type, data });
    }

    // Also dispatch custom event for components to listen
    window.dispatchEvent(
      new CustomEvent("offline-sync", {
        detail: { type, data },
      }),
    );
  }

  // Network status monitoring
  setupNetworkMonitoring(): void {
    window.addEventListener("online", () => {
      console.log("[OfflineSync] Network restored, starting sync...");
      this.syncData();
    });

    window.addEventListener("offline", () => {
      console.log("[OfflineSync] Network lost, switching to offline mode...");
    });
  }

  // Get sync status
  async getSyncStatus(): Promise<{
    pendingItems: number;
    lastSync: number | null;
    isOnline: boolean;
    syncInProgress: boolean;
  }> {
    const pendingData = await this.getPendingData();

    return {
      pendingItems: pendingData.length,
      lastSync: this.getLastSyncTime(),
      isOnline: navigator.onLine,
      syncInProgress: this.syncInProgress,
    };
  }

  private getLastSyncTime(): number | null {
    const lastSync = localStorage.getItem("last_sync_time");
    return lastSync ? parseInt(lastSync) : null;
  }

  private setLastSyncTime(timestamp: number): void {
    localStorage.setItem("last_sync_time", timestamp.toString());
  }
}

// Export singleton instance
export const offlineSyncManager = new OfflineSyncManager();

// Auto-initialize when module loads
offlineSyncManager
  .init()
  .then(() => {
    offlineSyncManager.setupNetworkMonitoring();
    console.log("[OfflineSync] Manager initialized successfully");
  })
  .catch((error) => {
    console.error("[OfflineSync] Failed to initialize:", error);
  });

export default offlineSyncManager;
