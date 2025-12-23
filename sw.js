const CACHE_NAME = "ps4master-final-v10";

const FILES = [
  "./",
  "index.html",
  "find.png",
  "goldhen.png",
  "wolf_optimized.webp",
  "no usb.webp",
  "karo.webp",
  "Gemini_Generated_Image_j8sn1j8sn1j8sn1j.webp",
  "ps4_wave_purple_compressed.jpg",
  "int64.js",
  "rop.js",
  "kexploit.js",
  "exploit.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      let totalFiles = FILES.length;
      let downloaded = 0;

      for (const file of FILES) {
        try {
          const res = await fetch(file, { cache: "no-store" });
          if (res.ok) {
            await cache.put(file, res.clone());
            downloaded++;
            const percent = Math.round((downloaded / totalFiles) * 100);
            const clients = await self.clients.matchAll();
            clients.forEach(client => client.postMessage({ type: 'PROGRESS', percent }));
          }
        } catch (err) { console.log("Skip:", file); }
      }
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
