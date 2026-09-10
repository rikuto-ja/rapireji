const CACHE_NAME = 'rapireji-cache-v2.2';
const ASSETS_TO_CACHE = [
  'index.html',
  'clerk.html',
  'discount.html',
  'extend.html',
  'history.html',
  'payment.html',
  'product.html',
  'qrcard.html',
  'qrpay.html',
  'register.html',
  'return.html',
  'returnpay.html',
  'scan.html',
  'settings.html',
  'stock.html',

  'beep1.mp3',
  'beep2.mp3',
  'beep3.mp3',
  'beep4.mp3',
  'beep5.mp3'
];

// 1. インストール時にファイルをキャッシュ＆即時有効化
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. 変更点: 古いバージョンのキャッシュを削除＆全ページを即座に制御下に置く
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. 変更点: ネットワーク優先（Network First）に切り替え
self.addEventListener('fetch', (event) => {
  // GETリクエスト以外はそのままネットワークへ
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // ネットワーク取得成功時：最新のレスポンスをキャッシュに保存して返す
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // オフライン時のみ：キャッシュから返す
        return caches.match(event.request, { ignoreSearch: true });
      })
  );
});
