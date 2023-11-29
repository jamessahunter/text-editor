const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// registerRoute(  // Here we define the callback function that will filter the requests we want to cache (in this case, JS and CSS files)
// ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
// new StaleWhileRevalidate({
//   // Name of the cache storage.
//   cacheName: 'asset-cache',
//   plugins: [
//     // CacheableResponsePlugin is used to configure which response statuses are considered cacheable. 
//     // In this case, responses with status codes 0 (offline) and 200 (OK) are considered cacheable.
//     new CacheableResponsePlugin({
//       statuses: [0, 200],
//     }),
//   ],
// }));

registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// TODO: Implement asset caching
registerRoute();
