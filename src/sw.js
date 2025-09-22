const CACHE_NAME = 'viksit-kanpur-v1.0.0';
const urlsToCache = [
  '/',
  '/App.tsx',
  '/styles/globals.css',
  '/manifest.json',
  // Add other static assets
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch((error) => {
        console.warn('Fetch failed for:', event.request.url, error);
        // Fallback for offline scenarios
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
        // For other resources, return a basic response
        return new Response('Resource not available offline', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline report submission (UI Demo Mode)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-reports') {
    event.waitUntil(syncReportsDemo());
  }
});

async function syncReportsDemo() {
  try {
    // This is a UI-only demo - no actual backend submission
    console.log('Demo: Background sync triggered for offline reports');
    
    // Show demo notification
    self.registration.showNotification('Report Submitted (Demo)', {
      body: 'This is a UI demonstration - no actual backend submission.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: 'report-demo'
    });
  } catch (error) {
    console.error('Background sync demo failed:', error);
  }
}

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('VIKSIT KANPUR', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    event.notification.close();
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for IndexedDB operations (Demo Mode)
async function getPendingReports() {
  // Demo mode - return empty array
  console.log('Demo: Getting pending reports from IndexedDB');
  return [];
}

async function removePendingReport(id) {
  // Demo mode - no actual removal
  console.log(`Demo: Removing pending report ${id} from IndexedDB`);
  return Promise.resolve();
}

// Note: This is a UI-only project for demonstration purposes
// In a real implementation, replace demo functions with actual backend integration