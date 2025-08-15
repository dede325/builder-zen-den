// PWA utilities for Clínica Bem Cuidar
// Angola-specific PWA features and offline support

export interface PWAInstallPrompt {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface SyncData {
  id: string;
  type: 'contact' | 'appointment';
  data: any;
  timestamp: string;
  retryCount: number;
}

// Angola-specific configuration
export const ANGOLA_CONFIG = {
  timeZone: 'Africa/Luanda',
  locale: 'pt-AO',
  currency: 'AOA',
  currencySymbol: 'Kz',
  dateFormat: 'dd/MM/yyyy',
  timeFormat: '24h',
  phoneFormat: '+244 XXX XXX XXX',
  emergencyNumbers: ['112', '113', '115'],
  businessHours: {
    weekdays: { start: '07:00', end: '19:00' },
    saturday: { start: '07:00', end: '13:00' },
    sunday: 'closed'
  }
};

class PWAManager {
  private deferredPrompt: PWAInstallPrompt | null = null;
  private isInstalled = false;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as any;
      this.showInstallPrompt();
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallPrompt();
      this.trackInstallation();
    });

    // Check if already installed
    this.checkIfInstalled();

    // Register service worker
    await this.registerServiceWorker();

    // Setup offline form sync
    this.setupOfflineSync();
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('[PWA] Service Worker registered successfully');

        // Listen for updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration!.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  this.showUpdatePrompt();
                }
              }
            });
          }
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event.data);
        });

      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    }
  }

  private checkIfInstalled() {
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
    
    this.isInstalled = isStandalone || isFullscreen || isMinimalUI || 
                     (window.navigator as any).standalone === true;

    if (this.isInstalled) {
      this.hideInstallPrompt();
    }
  }

  private showInstallPrompt() {
    if (this.isInstalled) return;

    // Create custom install prompt
    const installBanner = document.createElement('div');
    installBanner.id = 'pwa-install-banner';
    installBanner.className = 'pwa-install-banner';
    installBanner.innerHTML = `
      <div class="pwa-install-content">
        <div class="pwa-install-icon">
          <img src="/icons/icon-72x72.png" alt="Clínica Bem Cuidar" width="40" height="40">
        </div>
        <div class="pwa-install-text">
          <h3>Instalar Clínica Bem Cuidar</h3>
          <p>Acesso rápido e funcionalidades offline</p>
        </div>
        <div class="pwa-install-actions">
          <button class="pwa-install-btn" onclick="pwaManager.install()">Instalar</button>
          <button class="pwa-dismiss-btn" onclick="pwaManager.dismissInstall()">×</button>
        </div>
      </div>
    `;

    // Add styles
    if (!document.getElementById('pwa-install-styles')) {
      const styles = document.createElement('style');
      styles.id = 'pwa-install-styles';
      styles.textContent = `
        .pwa-install-banner {
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          max-width: 400px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(121, 203, 203, 0.2);
          z-index: 1000;
          animation: slideUp 0.3s ease-out;
        }

        .pwa-install-content {
          display: flex;
          align-items: center;
          padding: 16px;
          gap: 12px;
        }

        .pwa-install-icon img {
          border-radius: 8px;
        }

        .pwa-install-text {
          flex: 1;
        }

        .pwa-install-text h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .pwa-install-text p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .pwa-install-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .pwa-install-btn {
          background: linear-gradient(135deg, rgb(121, 203, 203), rgb(86, 98, 100));
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .pwa-install-btn:hover {
          transform: translateY(-1px);
        }

        .pwa-dismiss-btn {
          background: transparent;
          border: none;
          color: #6b7280;
          font-size: 18px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
        }

        .pwa-dismiss-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .pwa-install-banner {
            left: 10px;
            right: 10px;
          }
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(installBanner);

    // Auto-hide after 10 seconds
    setTimeout(() => {
      this.dismissInstall();
    }, 10000);
  }

  public async install() {
    if (!this.deferredPrompt) return;

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      
      this.deferredPrompt = null;
      this.hideInstallPrompt();
    } catch (error) {
      console.error('[PWA] Install error:', error);
    }
  }

  public dismissInstall() {
    this.hideInstallPrompt();
    // Store dismissal to avoid showing again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  }

  private hideInstallPrompt() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.remove();
    }
  }

  private showUpdatePrompt() {
    // Create update notification
    const updateBanner = document.createElement('div');
    updateBanner.id = 'pwa-update-banner';
    updateBanner.className = 'pwa-install-banner';
    updateBanner.innerHTML = `
      <div class="pwa-install-content">
        <div class="pwa-install-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            <path d="m9 9 5 12 1.8-5.2L21 14Z"/>
          </svg>
        </div>
        <div class="pwa-install-text">
          <h3>Atualização Disponível</h3>
          <p>Nova versão da aplicação pronta para instalar</p>
        </div>
        <div class="pwa-install-actions">
          <button class="pwa-install-btn" onclick="pwaManager.updateApp()">Atualizar</button>
          <button class="pwa-dismiss-btn" onclick="pwaManager.dismissUpdate()">×</button>
        </div>
      </div>
    `;

    document.body.appendChild(updateBanner);
  }

  public updateApp() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  public dismissUpdate() {
    const banner = document.getElementById('pwa-update-banner');
    if (banner) {
      banner.remove();
    }
  }

  private trackInstallation() {
    // Track PWA installation for analytics
    console.log('[PWA] App installed successfully');
    
    // Send analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'pwa_install', {
        app_name: 'Clínica Bem Cuidar',
        platform: navigator.platform,
        locale: ANGOLA_CONFIG.locale
      });
    }
  }

  private handleServiceWorkerMessage(data: any) {
    switch (data.type) {
      case 'SYNC_SUCCESS':
        this.showSyncSuccessNotification(data.data);
        break;
      case 'OFFLINE_FORM_STORED':
        this.showOfflineFormNotification();
        break;
      default:
        console.log('[PWA] Received message from SW:', data);
    }
  }

  private showSyncSuccessNotification(data: any) {
    // Show notification that form was synced
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Formulário Sincronizado', {
        body: 'Seus dados foram enviados com sucesso.',
        icon: '/icons/icon-192x192.png',
        tag: 'sync-success'
      });
    }
  }

  private showOfflineFormNotification() {
    // Show notification that form was stored offline
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Dados Salvos Offline', {
        body: 'Seus dados serão enviados quando a conexão for restaurada.',
        icon: '/icons/icon-192x192.png',
        tag: 'offline-storage'
      });
    }
  }

  // Offline form storage utilities
  public async storeFormOffline(type: 'contact' | 'appointment', data: any): Promise<string> {
    const syncData: SyncData = {
      id: this.generateId(),
      type,
      data,
      timestamp: new Date().toISOString(),
      retryCount: 0
    };

    try {
      const db = await this.openIndexedDB();
      await this.saveToIndexedDB(db, `${type}-forms`, syncData);
      
      // Register background sync
      if (this.registration && 'sync' in this.registration) {
        await this.registration.sync.register(`${type}-form-sync`);
      }

      console.log('[PWA] Form stored offline:', syncData.id);
      return syncData.id;
    } catch (error) {
      console.error('[PWA] Failed to store form offline:', error);
      throw error;
    }
  }

  private async openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ClinicaBemCuidar', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('contact-forms')) {
          const store = db.createObjectStore('contact-forms', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
        }
        
        if (!db.objectStoreNames.contains('appointment-forms')) {
          const store = db.createObjectStore('appointment-forms', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
        }
      };
    });
  }

  private async saveToIndexedDB(db: IDBDatabase, storeName: string, data: SyncData): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupOfflineSync() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('[PWA] Connection restored, triggering sync');
      this.triggerBackgroundSync();
    });

    window.addEventListener('offline', () => {
      console.log('[PWA] Connection lost, preparing for offline mode');
    });
  }

  private async triggerBackgroundSync() {
    if (this.registration && 'sync' in this.registration) {
      try {
        await this.registration.sync.register('contact-form-sync');
        await this.registration.sync.register('appointment-sync');
        console.log('[PWA] Background sync registered');
      } catch (error) {
        console.error('[PWA] Background sync registration failed:', error);
      }
    }
  }

  // Angola-specific utilities
  public formatPhone(phone: string): string {
    // Format phone number for Angola (+244)
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 9) {
      return `+244 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('244')) {
      const number = cleaned.slice(3);
      return `+244 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
    }
    
    return phone; // Return original if formatting fails
  }

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat(ANGOLA_CONFIG.locale, {
      style: 'currency',
      currency: ANGOLA_CONFIG.currency,
      currencyDisplay: 'symbol'
    }).format(amount);
  }

  public formatDate(date: Date): string {
    return new Intl.DateTimeFormat(ANGOLA_CONFIG.locale, {
      timeZone: ANGOLA_CONFIG.timeZone,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  public formatTime(date: Date): string {
    return new Intl.DateTimeFormat(ANGOLA_CONFIG.locale, {
      timeZone: ANGOLA_CONFIG.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  }

  public isBusinessHours(date: Date = new Date()): boolean {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const time = this.formatTime(date);
    
    if (dayOfWeek === 0) return false; // Sunday closed
    
    if (dayOfWeek === 6) { // Saturday
      return time >= ANGOLA_CONFIG.businessHours.saturday.start && 
             time <= ANGOLA_CONFIG.businessHours.saturday.end;
    }
    
    // Weekdays
    return time >= ANGOLA_CONFIG.businessHours.weekdays.start && 
           time <= ANGOLA_CONFIG.businessHours.weekdays.end;
  }

  // Request notification permission
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('[PWA] Notification permission:', permission);
      return permission;
    }
    return 'denied';
  }

  // Get installation status
  public getInstallationStatus() {
    return {
      isInstalled: this.isInstalled,
      canInstall: !!this.deferredPrompt,
      isOnline: navigator.onLine,
      hasServiceWorker: !!this.registration
    };
  }
}

// Create global instance
export const pwaManager = new PWAManager();

// Make available globally for HTML onclick handlers
(window as any).pwaManager = pwaManager;

console.log('[PWA] PWA Manager initialized for Clínica Bem Cuidar');
