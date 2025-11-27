const CACHE_NAME = "ps4host-v2";

const FILES_TO_CACHE = [
  "./",
  "index.html",
  "find.png",
  "goldhen.png",
  "wolf_optimized.webp",
  "no usb.webp",
  "karo.webp",
  "Gemini_Generated_Image_j8sn1j8sn1j8sn1j.webp",
  "ps4-luminous-wave-0xd36pumgigbl01x.jpg"
];

// نصب Service Worker و کش کردن فایل‌ها
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// فعال‌سازی
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(k => {
          if(k !== CACHE_NAME){
            return caches.delete(k);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// واکشی فایل‌ها (اول کش، بعد اینترنت)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});
