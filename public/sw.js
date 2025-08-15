// Service Worker para Clínica Bem Cuidar PWA
// Versão: 1.0.0
// Localização: Angola (pt-AO)

const CACHE_VERSION = 'bem-cuidar-v1.0.0';
const OFFLINE_VERSION = 'offline-v1.0.0';

// Cache names
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGES_CACHE = `${CACHE_VERSION}-images`;
const API_CACHE = `${CACHE_VERSION}-api`;
const OFFLINE_CACHE = `${OFFLINE_VERSION}-offline`;

// URLs to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/global.css',
  // Critical CSS and JS will be added dynamically
];

// URLs for offline fallback
const OFFLINE_FALLBACK_PAGE = '/offline';

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/especialidades',
  '/api/horarios',
  '/api/contacto',
  '/api/server-date'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache offline page
      caches.open(OFFLINE_CACHE).then(cache => {
        console.log('[SW] Caching offline page');
        return cache.add(OFFLINE_FALLBACK_PAGE);
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      // Skip waiting to activate immediately
      return self.skipWaiting();
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheName.startsWith(CACHE_VERSION) && 
                !cacheName.startsWith(OFFLINE_VERSION)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all pages
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation complete');
    })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - network first with cache fallback
    event.respondWith(handleApiRequest(request));
  } else if (isImageRequest(request)) {
    // Images - cache first with network fallback
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(request)) {
    // Static assets - cache first
    event.respondWith(handleStaticRequest(request));
  } else {
    // HTML pages - network first with offline fallback
    event.respondWith(handlePageRequest(request));
  }
});

// Handle API requests
async function handleApiRequest(request) {
  const cacheName = API_CACHE;
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for API, trying cache:', request.url);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        error: 'Sem conexão de internet',
        message: 'Por favor, verifique a sua ligação à internet e tente novamente.',
        timestamp: new Date().toISOString()
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      }
    );
  }
}

// Handle image requests
async function handleImageRequest(request) {
  const cacheName = IMAGES_CACHE;
  
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Try network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the image
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to load image:', request.url);
    
    // Return placeholder image
    return new Response(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f3f4f6"/>
        <text x="200" y="150" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="16">
          Imagem indisponível
        </text>
      </svg>`,
      {
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    );
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  const cacheName = STATIC_CACHE;
  
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Try network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the asset
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to load static asset:', request.url);
    throw error;
  }
}

// Handle page requests
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful page responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for page, trying cache:', request.url);
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    console.log('[SW] Serving offline page');
    return caches.match(OFFLINE_FALLBACK_PAGE);
  }
}

// Helper functions
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(new URL(request.url).pathname);
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  return request.destination === 'script' ||
         request.destination === 'style' ||
         /\.(js|css|woff|woff2|ttf|eot)$/i.test(url.pathname);
}

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'form-submission') {
    event.waitUntil(syncFormSubmissions());
  }
  
  if (event.tag === 'appointment-booking') {
    event.waitUntil(syncAppointmentBookings());
  }
});

// Sync offline form submissions
async function syncFormSubmissions() {
  try {
    const db = await openIndexedDB();
    const submissions = await getStoredSubmissions(db);
    
    for (const submission of submissions) {
      try {
        const response = await fetch('/api/contacto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission.data)
        });
        
        if (response.ok) {
          await removeSubmission(db, submission.id);
          console.log('[SW] Form submission synced:', submission.id);
        }
      } catch (error) {
        console.log('[SW] Failed to sync submission:', submission.id, error);
      }
    }
  } catch (error) {
    console.log('[SW] Error syncing form submissions:', error);
  }
}

// Sync offline appointment bookings
async function syncAppointmentBookings() {
  try {
    const db = await openIndexedDB();
    const bookings = await getStoredBookings(db);
    
    for (const booking of bookings) {
      try {
        const response = await fetch('/api/agendamento', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(booking.data)
        });
        
        if (response.ok) {
          await removeBooking(db, booking.id);
          console.log('[SW] Appointment booking synced:', booking.id);
        }
      } catch (error) {
        console.log('[SW] Failed to sync booking:', booking.id, error);
      }
    }
  } catch (error) {
    console.log('[SW] Error syncing appointment bookings:', error);
  }
}

// IndexedDB helpers (simplified)
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BemCuidarDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('submissions')) {
        db.createObjectStore('submissions', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('bookings')) {
        db.createObjectStore('bookings', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getStoredSubmissions(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['submissions'], 'readonly');
    const store = transaction.objectStore('submissions');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function getStoredBookings(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['bookings'], 'readonly');
    const store = transaction.objectStore('bookings');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function removeSubmission(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['submissions'], 'readwrite');
    const store = transaction.objectStore('submissions');
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

function removeBooking(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['bookings'], 'readwrite');
    const store = transaction.objectStore('bookings');
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Push notification handling
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'Tem uma nova mensagem da Clínica Bem Cuidar',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Detalhes',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Clínica Bem Cuidar', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click received.');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/portal'));
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    event.waitUntil(clients.openWindow('/'));
  }
});

console.log('[SW] Service Worker loaded successfully');
