/* 산본글로벌어학원 SGA App - service worker */
var CACHE = 'sga-v3';   /* 2026-09-17 캐시 세대 교체 — 옛 캐시 자동 삭제 */
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
  /* 2026-09-15 — 다른 사이트로 나가는 요청(유튜브·네이버 블로그 RSS 등)은
     서비스워커가 손대지 않습니다. 전에는 실패하면 app.html 을 대신 돌려줘서
     JSON 을 요청했는데 HTML 이 돌아오는 일이 있었습니다. */
  try { if (new URL(r.url).origin !== self.location.origin) return; } catch (x) { return; }
  /* 2026-09-17 — HTML(화면 자체)은 브라우저 캐시를 건너뛰고 항상 서버에서 새로 받습니다.
     고친 화면이 대표님께 바로 보이지 않고 옛 화면이 계속 뜨던 원인입니다.
     이미지·소리·영상은 그대로 캐시를 씁니다(느려지면 안 되므로). */
  var isHTML = (r.mode === 'navigate') ||
               (r.headers.get('accept') || '').indexOf('text/html') > -1 ||
               /\.html(\?|$)/.test(r.url) ||
               new URL(r.url).pathname === '/';
  var req = isHTML ? new Request(r.url, {cache: 'no-store', credentials: 'same-origin'}) : r;
  e.respondWith(
    fetch(req).then(function (res) {
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
