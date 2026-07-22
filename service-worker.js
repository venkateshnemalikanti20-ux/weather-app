 const CACHE_NAME = "skycast-v3";

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];


self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching app files...");
      return cache.addAll(urlsToCache);
    })
  );
});


self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Don't intercept requests to external websites
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});