// نسخه‌ی جدید SW با index.html
const CACHE_NAME = "ps4-hub-v1";

const FILES_TO_CACHE = [
  "/",
  "index.html",  // به‌روزرسانی شده طبق درخواست
  "style.css",

  // تصاویر پروژه
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
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// فعال‌سازی و حذف کش‌های قدیمی
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// مدیریت درخواست‌ها
self.addEventListener("fetch", event => {
  const req = event.request;

  // درخواست برای فایل‌های داخلی → cache-first
  if (req.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req))
    );
    return;
  }

  // لینک‌های سایت‌های خارجی → بدون دستکاری
  event.respondWith(fetch(req));
});
