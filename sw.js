const CACHE_NAME = "ps4host-v3";

// ⚠️ مسیر کامل فایل‌ها  
// چون سایتت در مسیر /900/ هست، باید همه فایل‌ها با /900/... شروع بشن
const FILES_TO_CACHE = [
  "/900/",
  "/900/index.html",
  "/900/find.png",
  "/900/goldhen.png",
  "/900/wolf_optimized.webp",
  "/900/no usb.webp",
  "/900/karo.webp",
  "/900/Gemini_Generated_Image_j8sn1j8sn1j8sn1j.webp",
  "/900/ps4_wave_purple_compressed.jpg"
];

// ------------------------------
// INSTALL → تکی تکی کش بشه (سازگار با PS4)
// ------------------------------
self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      for (const file of FILES_TO_CACHE) {
        try {
          const res = await fetch(file, { cache: "no-store" });
          if (res.ok) {
            await cache.put(file, res.clone());
          } else {
            console.warn("Skip (not ok):", file);
          }
        } catch (err) {
          console.warn("Skip (error):", file);
        }
      }

      self.skipWaiting();
    })()
  );
});

// ------------------------------
// ACTIVATE → پاک کردن کش قدیمی
// ------------------------------
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// ------------------------------
// FETCH → cache-first
// ------------------------------
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached ||
        fetch(event.request).catch(() => cached);
    })
  );
});

