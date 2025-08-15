// Service Worker for Clínica Bem Cuidar PWA
// Enhanced for Angola locale and medical data compliance

const CACHE_NAME = "clinica-bem-cuidar-v1.3.0";
const STATIC_CACHE = "static-v1.3.0";
const DYNAMIC_CACHE = "dynamic-v1.3.0";
const OFFLINE_PAGE = "/offline.html";

// Core assets to cache (critical for PWA functionality)
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/global.css",
  // App shell
  "/src/main.tsx",
  "/src/App.tsx",
  "/src/components/ui/button.tsx",
  "/src/components/ui/card.tsx",
  // Icons for offline use
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  // Critical fonts (if using local fonts)
  "/fonts/inter-regular.woff2",
  "/fonts/inter-medium.woff2",
  "/fonts/inter-semibold.woff2",
];

// API endpoints to cache for offline functionality
const API_CACHE_PATTERNS = [
  /^.*\/api\/specialties/,
  /^.*\/api\/schedule/,
  /^.*\/api\/contact-info/,
  /^.*\/api\/server-date/,
];

// Image patterns for caching
const IMAGE_CACHE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|webp|avif)$/,
  /unsplash\.com/,
  /images\.pexels\.com/,
  /cdn\.builder\.io/,
];

// Angola-specific considerations
const ANGOLA_CONFIG = {
  timeZone: "Africa/Luanda",
  currency: "AOA",
  locale: "pt-AO",
  emergencyNumbers: ["112", "113", "115"],
  dataRetentionDays: 30, // For offline form data
};

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing Service Worker for Clínica Bem Cuidar...");

  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("[SW] Caching static assets...");
        return cache.addAll(STATIC_ASSETS.filter((url) => url !== null));
      }),

      // Create offline page cache
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log("[SW] Creating offline page cache...");
        return cache.add(OFFLINE_PAGE);
      }),
    ])
      .then(() => {
        console.log("[SW] Installation completed successfully");
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[SW] Installation failed:", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating Service Worker...");

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== CACHE_NAME
            ) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      }),

      // Take control of all clients
      self.clients.claim(),
    ])
      .then(() => {
        console.log("[SW] Activation completed successfully");
      })
      .catch((error) => {
        console.error("[SW] Activation failed:", error);
      }),
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests for PWA
  if (request.method !== "GET") {
    return;
  }

  // Skip browser-extension requests
  if (
    url.protocol === "chrome-extension:" ||
    url.protocol === "moz-extension:"
  ) {
    return;
  }

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);

  try {
    // Strategy 1: Network First for API calls (real-time medical data)
    if (isAPIRequest(url)) {
      return await networkFirstStrategy(request);
    }

    // Strategy 2: Cache First for images and static assets
    if (isStaticAsset(url) || isImageRequest(url)) {
      return await cacheFirstStrategy(request);
    }

    // Strategy 3: Stale While Revalidate for HTML pages
    if (isHTMLRequest(request)) {
      return await staleWhileRevalidateStrategy(request);
    }

    // Default: Network with cache fallback
    return await networkWithCacheFallback(request);
  } catch (error) {
    console.error("[SW] Fetch error:", error);
    return await getOfflineFallback(request);
  }
}

// Network First Strategy - for APIs
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log("[SW] Network failed, trying cache for:", request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline API response for critical endpoints
    if (request.url.includes("/api/")) {
      return new Response(
        JSON.stringify({
          error: "Sem conexão à internet",
          message:
            "Os dados serão sincronizados quando a conexão for restaurada",
          timestamp: new Date().toISOString(),
          angola_time: new Date().toLocaleString("pt-AO", {
            timeZone: ANGOLA_CONFIG.timeZone,
          }),
        }),
        {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    throw error;
  }
}

// Cache First Strategy - for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error("[SW] Failed to fetch static asset:", request.url);
    throw error;
  }
}

// Stale While Revalidate Strategy - for HTML pages
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);

  // Fetch in background to update cache
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then((c) => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => null);

  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }

  // Otherwise wait for network
  return (await fetchPromise) || getOfflineFallback(request);
}

// Network with Cache Fallback
async function networkWithCacheFallback(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || getOfflineFallback(request);
  }
}

// Get offline fallback
async function getOfflineFallback(request) {
  if (isHTMLRequest(request)) {
    return (
      (await caches.match(OFFLINE_PAGE)) ||
      new Response("Página offline não encontrada", { status: 404 })
    );
  }

  return new Response("Recurso não disponível offline", {
    status: 503,
    statusText: "Service Unavailable",
  });
}

// Helper functions
function isAPIRequest(url) {
  return (
    url.pathname.startsWith("/api/") ||
    API_CACHE_PATTERNS.some((pattern) => pattern.test(url.href))
  );
}

function isStaticAsset(url) {
  return (
    url.pathname.includes("/static/") ||
    url.pathname.includes("/assets/") ||
    url.pathname.includes("/css/") ||
    url.pathname.includes("/js/") ||
    url.pathname.includes("/fonts/")
  );
}

function isImageRequest(url) {
  return IMAGE_CACHE_PATTERNS.some((pattern) => pattern.test(url.href));
}

function isHTMLRequest(request) {
  return request.headers.get("accept")?.includes("text/html");
}

// Background Sync for form submissions (Angola compliance)
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag);

  if (event.tag === "contact-form-sync") {
    event.waitUntil(syncContactForms());
  }

  if (event.tag === "appointment-sync") {
    event.waitUntil(syncAppointments());
  }
});

// Sync contact forms when connection is restored
async function syncContactForms() {
  try {
    const db = await openIndexedDB();
    const forms = await getStoredForms(db, "contact-forms");

    for (const form of forms) {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form.data),
        });

        if (response.ok) {
          await removeStoredForm(db, "contact-forms", form.id);
          console.log("[SW] Successfully synced contact form:", form.id);

          // Notify client about successful sync
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: "SYNC_SUCCESS",
                data: { formType: "contact", id: form.id },
              });
            });
          });
        }
      } catch (error) {
        console.error("[SW] Failed to sync form:", form.id, error);
      }
    }
  } catch (error) {
    console.error("[SW] Sync contact forms failed:", error);
  }
}

// Push notifications for appointments (Angola medical requirements)
self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received");

  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || "Nova notificação da Clínica Bem Cuidar",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-72x72.png",
      data: data.data || {},
      actions: [
        {
          action: "view",
          title: "Ver Detalhes",
          icon: "/icons/action-view.png",
        },
        {
          action: "dismiss",
          title: "Dispensar",
        },
      ],
      lang: "pt-AO",
      tag: data.tag || "clinic-notification",
      renotify: true,
      requireInteraction: data.urgent || false,
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || "Clínica Bem Cuidar",
        options,
      ),
    );
  } catch (error) {
    console.error("[SW] Push notification error:", error);
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.notification.tag);

  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === "view" && data.url) {
    event.waitUntil(clients.openWindow(data.url));
  } else if (action === "dismiss") {
    // Log dismissal for analytics
    console.log("[SW] Notification dismissed by user");
  } else {
    // Default action - open app
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clients) => {
        if (clients.length > 0) {
          return clients[0].focus();
        }
        return clients.openWindow("/");
      }),
    );
  }
});

// IndexedDB helpers for offline storage
async function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ClinicaBemCuidar", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create stores for offline data
      if (!db.objectStoreNames.contains("contact-forms")) {
        const store = db.createObjectStore("contact-forms", { keyPath: "id" });
        store.createIndex("timestamp", "timestamp");
      }

      if (!db.objectStoreNames.contains("appointments")) {
        const store = db.createObjectStore("appointments", { keyPath: "id" });
        store.createIndex("timestamp", "timestamp");
      }
    };
  });
}

async function getStoredForms(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function removeStoredForm(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Cache cleanup based on Angola data retention policies
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEANUP_CACHE") {
    event.waitUntil(cleanupOldCache());
  }

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function cleanupOldCache() {
  try {
    const cacheNames = await caches.keys();
    const retentionDate = new Date();
    retentionDate.setDate(
      retentionDate.getDate() - ANGOLA_CONFIG.dataRetentionDays,
    );

    // Clean up dynamic cache entries older than retention period
    const dynamicCache = await caches.open(DYNAMIC_CACHE);
    const keys = await dynamicCache.keys();

    for (const request of keys) {
      const response = await dynamicCache.match(request);
      if (response) {
        const dateHeader = response.headers.get("date");
        if (dateHeader) {
          const responseDate = new Date(dateHeader);
          if (responseDate < retentionDate) {
            await dynamicCache.delete(request);
            console.log("[SW] Cleaned up old cache entry:", request.url);
          }
        }
      }
    }

    console.log("[SW] Cache cleanup completed");
  } catch (error) {
    console.error("[SW] Cache cleanup failed:", error);
  }
}

console.log("[SW] Service Worker script loaded successfully");
