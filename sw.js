const CACHE_NAME = "brikscan-v1";
const FICHIERS_A_METTRE_EN_CACHE = [
  "./brikscan.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FICHIERS_A_METTRE_EN_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((noms) =>
      Promise.all(
        noms.filter((nom) => nom !== CACHE_NAME).map((nom) => caches.delete(nom))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Les appels aux API d'IA ne doivent jamais être mis en cache (données dynamiques)
  if (event.request.url.includes("googleapis.com") || event.request.url.includes("anthropic.com")) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((reponse) => reponse || fetch(event.request))
  );
});
