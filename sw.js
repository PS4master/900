const CACHE_NAME = "ps4host-v1";

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

// ارسال درصد پیشرفت به صفحه
function sendStatus(msg){
  self.clients.matchAll().then(clients=>{
    clients.forEach(c=>c.postMessage(msg));
  });
}

self.addEventListener("install", event => {
  event.waitUntil((async ()=>{
    const cache = await caches.open(CACHE_NAME);

    let done = 0;
    const total = FILES_TO_CACHE.length;

    for(const file of FILES_TO_CACHE){
      await cache.add(file);
      done++;
      sendStatus({
        type: "CACHE_PROGRESS",
        percent: Math.round((done / total) * 100)
      });
    }
  })());

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );
});





