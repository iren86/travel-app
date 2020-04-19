console.log('WORKER: executing.');

/** A version number is useful when updating the worker logic,
   allowing you to remove outdated cache entries during the update.
*/
// Set a name for the current cache
const cacheName = 'v1';

/** These resources will be downloaded and cached by the service worker
   during the installation process. If any resource fails to be downloaded,
   then the service worker won't be installed either.
*/
const offlineFundamentals = [
  './dist/bundle.js',
  './dist/index.html',
  './src/client/styles/'
];

self.addEventListener("install", function(event) {
  console.log('WORKER: install event in progress.');
  event.waitUntil(
    // The caches built-in is a promise-based API that helps you cache responses,
    // as well as finding and deleting them.
    caches
      // You can open a cache by name, and this method returns a promise. We use
      // a versioned cache name here so that we can remove old cache entries in
      // one fell swoop later, when phasing out an older service worker.
      .open(cacheName + 'fundamentals')
      .then(function(cache) {
        // After the cache is opened, we can fill it with the offline fundamentals.
        // The method below will add all resources we've indicated to the cache,
        // after making HTTP requests for each of them.
        return cache.addAll(offlineFundamentals);
      })
      .then(function() {
        console.log('WORKER: install completed');
      })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});
