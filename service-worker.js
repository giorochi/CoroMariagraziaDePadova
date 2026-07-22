const CACHE_NAME = "coro-mdp-v2"; // Incrementato per forzare l'aggiornamento

// Salviamo in cache solo i file necessari per la nuova SPA
const FILES_TO_CACHE = [
  "./",
  "index.html",
  "manifest.json",
  "dati/canti.json"
];

// 1. Installazione Service Worker e salvataggio file nuovi
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// 2. Attivazione ed eliminazione automatica della vecchia cache V1
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Gestione richieste della rete (stategia Network First / Cache Fallback)
self.addEventListener("fetch", (event) => {
  // Ignora le richieste non-GET (es. API)
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se la rete risponde correttamente, aggiorna la cache in background
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Se offline, recupera il file dalla cache
        return caches.match(event.request);
      })
  );
});
