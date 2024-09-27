import { skipWaiting, clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import {
  NetworkOnly,
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import {
  registerRoute,
  setDefaultHandler,
  setCatchHandler,
} from 'workbox-routing';
import {
  matchPrecache,
  precacheAndRoute,
  cleanupOutdatedCaches,
} from 'workbox-precaching';

skipWaiting();
clientsClaim();

// must include following lines when using inject manifest module from workbox
const WB_MANIFEST = self.__WB_MANIFEST;
// Precache fallback route and image
WB_MANIFEST.push({
  url: '/fallback',
  revision: '1234567890',
});
precacheAndRoute(WB_MANIFEST);

cleanupOutdatedCaches();
registerRoute(
  '/',
  new NetworkFirst({
    cacheName: 'start-url',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  'GET'
);
registerRoute(
  /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 4,
        maxAgeSeconds: 31536e3,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  'GET'
);
registerRoute(
  /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
  new StaleWhileRevalidate({
    cacheName: 'static-font-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 4,
        maxAgeSeconds: 604800,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  'GET'
);
registerRoute(
  /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
  new NetworkOnly({
    cacheName: 'static-image-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 64,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  'GET'
);
registerRoute(
  /\.(?:js)$/i,
  new StaleWhileRevalidate({
    cacheName: 'static-js-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  'GET'
);
registerRoute(
  /\.(?:css|less)$/i,
  new StaleWhileRevalidate({
    cacheName: 'static-style-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  'GET'
);
registerRoute(
  /\.(?:json|xml|csv)$/i,
  new NetworkFirst({
    cacheName: 'static-data-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  'GET'
);
registerRoute(
  /\/api\/.*$/i,
  new NetworkFirst({
    cacheName: 'apis',
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 16,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  'GET'
);
registerRoute(
  /.*/i,
  new NetworkFirst({
    cacheName: 'others',
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  'GET'
);

// Add push notification handler
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const notificationData = data.notification;

  const title = notificationData.title || 'Notification';
  const options = {
    body:
      notificationData.body ||
      notificationData.message ||
      'You have a new notification!',
    icon: notificationData.icon || '/icon.png',
    badge: notificationData.badge || '/badge.png',
    data: {
      url: notificationData.url || data.url || '/', // Use URL from notification or top-level data
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Add notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const urlToOpen = event.notification.data.url;
      const client = clientList.find(
        (c) => c.url === urlToOpen && 'focus' in c
      );

      if (client) {
        return client.focus();
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle fallback strategies for offline support
setDefaultHandler(new StaleWhileRevalidate());

setCatchHandler(({ event }) => {
  switch (event.request.destination) {
    case 'document':
      return matchPrecache('/fallback');
    case 'image':
      return matchPrecache('/static/images/fallback.png');
    default:
      return Response.error();
  }
});
