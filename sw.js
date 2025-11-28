const CACHE_NAME = "ps4host-v4";  // نسخه جدید

const FILES_TO_CACHE = [
  "/900/",
  "/900/index.html",
  "/900/find.png",
  "/900/goldhen.png",
  "/900/wolf_optimized.webp",
  "/900/no usb.webp",
  "/900/karo.webp",
  "/900/Gemini_Generated_Image_j8sn1j8sn1j8sn1j.webp",
  "/900/ps4-luminous-wave-0xd36pumgigbl01x.jpg"
];

// ========== INSTALL ==========
self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      for (const file of FILES_TO_CACHE) {
        try {
          const res = await fetch(file, { cache: "no-store" });
          if (res.ok) await cache.put(file, res.clone());
        } catch (e) {
          console.warn("Skip:", file);
        }
      }

      // نسخه جدید را *اجباری* فعال می‌کند
      await self.skipWaiting();
    })()
  );
});

// ========== ACTIVATE ==========
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k)) // پاک کردن کامل ورژن‌های قبلی
      );
    })
  );
  self.clients.claim();
});

// ========== FETCH ==========
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => cached);
    })
  );
});
