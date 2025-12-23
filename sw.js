const CACHE_NAME = "ps4-cache-v3";  // 🔥 نسخه جدید

const FILES = [
  "index.html",
  "find.png",
  "goldhen.png",
  "wolf_optimized.webp",
  "no usb.webp",
  "karo.webp",
  "Gemini_Generated_Image_j8sn1j8sn1j8sn1j.webp",
  "ps4_wave_purple_compressed.jpg"
];

// -------------------------
// INSTALL (PS4-safe)
// -------------------------
self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // کش کردن فایل‌ها یکی‌یکی تا PS4 کرش نکنه
      for (const file of FILES) {
        try {
          const res = await fetch(file, { cache: "no-store" });
          if (res.ok) await cache.put(file, res.clone());
        } catch (err) {
          console.log("PS4 Cache skip:", file);
        }
      }

      self.skipWaiting();
    })()
  );
});

// -------------------------
// ACTIVATE (پاک کردن نسخه‌های قدیمی)
// -------------------------
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

// -------------------------
// FETCH (cache-first)
// -------------------------
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request).catch(() => cached)
      );
    })
  );
});


