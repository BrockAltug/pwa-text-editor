const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst } = require("workbox-strategies");

const { StaleWhileRevalidate } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // Set the cache expiration to 30 days
    }),
  ],
});

warmStrategyCache({
  urls: ["/index.html", "/"], // Pre-cache the main entry points of the application
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);

// Set up caching strategy for specific assets like JS, CSS, and Workers
registerRoute(
  // Filter requests for styles, scripts, and workers to apply the caching strategy
  ({ request }) => ["style", "script", "worker"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: "asset-cache", // Set up cache specifically for assets like JS and CSS
    plugins: [
      // Cache responses for up to 30 days based on status codes 0 and 200
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);