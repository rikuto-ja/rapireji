const CACHE_NAME = 'rapireji-cache-v1';
const ASSETS_TO_CACHE = [
  './history.html',
  './payment.html',
  './product.html', 
  './register.html',
  './return.html',
  './returnpay.html',
  './scan.html',
  './settings.html',
  './stock.html',

  './beep1.mp3',
  './beep2.mp3',
  './beep3.mp3',
  './beep4.mp3',
];

// インストール時にファイルをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// オフライン時はキャッシュから応答（広告などは無視される）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
