/* 산본글로벌어학원 SGA App - service worker */
var CACHE = 'sga-v1';
var CORE = ['./app.html', './img/logo.png', './img/sga_logo.png'];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(CORE.map(function (u) {
        return c.add(u).catch(function () {});
      }));
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* network-first: 항상 최신을 먼저 시도하고, 오프라인일 때만 캐시 */
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  if (r.url.indexOf('http') !== 0) return;
  e.respondWith(
    fetch(r).then(function (res) {
      if (res && res.status === 200 && res.type === 'basic') {
        var cp = res.clone();
        caches.open(CACHE).then(function (c) { c.put(r, cp).catch(function () {}); });
      }
      return res;
    }).catch(function () {
      return caches.match(r).then(function (m) {
        return m || caches.match('./app.html');
      });
    })
  );
});
