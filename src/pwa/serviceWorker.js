import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

// Take control of all pages immediately.
self.skipWaiting();
clientsClaim();

// Precache static assets (injected by Vite-PWA during build)
precacheAndRoute(self.__WB_MANIFEST || []);

// App Shell Routing
try {
  // Let Vite-PWA route requests to index.html
  const handler = createHandlerBoundToURL('/index.html');
  const navigationRoute = new NavigationRoute(handler, {
    denylist: [/^\/api\//], // API endpoints shouldn't fallback to index.html
  });
  registerRoute(navigationRoute);
} catch (e) {
  console.log('Error registering navigation route:', e);
}

// 1. Core API Strategy - Cache First for static/seldom changing API data like donor list
// (Wait, API data should be NetworkFirst to get latest. Let's use NetworkFirst with a fast fallback)
registerRoute(
  /^https?:\/\/[^/]+\/api\/.*/i,
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5,
    matchOptions: {
      ignoreSearch: false,
    },
  })
);

// 2. Leaflet Tiles Strategy - Cache First for performance
registerRoute(
  /^https:\/\/[a-z0-9.-]+\.tile\.openstreetmap\.org\/.*/i,
  new CacheFirst({
    cacheName: 'map-tiles-cache',
  })
);

// 3. Any other static assets not in precache (if any)
registerRoute(
  ({ request }) => request.destination === 'image' || request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// Optional: Push notifications placeholder
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Notification', body: 'New blood request!' };
  const getIcon = () => 'pwa-192.png';
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: getIcon(),
    })
  );
});
