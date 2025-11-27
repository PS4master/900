// نسخه جدید SW مخصوص PS4
const CACHE_NAME = "ps4-hub-v1";

const FILES_TO_CACHE = [
  "/",
  "index.html",

  // فایل‌های UI
  "style.css",

  // تصاویر
  "find.png",
  "goldhen.png",
  "wolf_optimized.webp",
  "no usb.webp",
  "Gemini_Generated_Image_j8sn1j8sn1j8sn1j.webp",
  "ps4-luminous-wave-0xd36pumgigbl01x.jpg",
  "karo.webp"
];

// نصب Service Worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// فعال‌سازی و پاک‌سازی کش‌های قدیمی
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// مدیریت درخواست‌ها
self.addEventListener("fetch", event => {

  // درخواست‌های داخلی → cache-first
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request);
      })
    );
    return;
  }

  // درخواست‌های خارجی → مستقیم از اینترنت
  event.respondWith(fetch(event.request));
});

