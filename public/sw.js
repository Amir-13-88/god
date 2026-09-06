/* واژه‌آموز آکسفورد — service worker: کش خودترمیم برای کارکرد کاملاً آفلاین */
const VERSION = "oxfordfa-v1";
const CORE = "core-" + VERSION;
const RUNTIME = "runtime-" + VERSION;
const FONTS = "fonts-" + VERSION;

const CORE_ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CORE)
      .then((c) => c.addAll(CORE_ASSETS).catch(() => null))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CORE && k !== RUNTIME && k !== FONTS).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (e) => {
  const d = e.data;
  if (d === "SKIP_WAITING" || (d && d.type === "SKIP_WAITING")) {
    self.skipWaiting();
    return;
  }
  if (d && d.type === "PRECACHE" && Array.isArray(d.urls)) {
    const origin = self.location.origin;
    const same = d.urls.filter((u) => {
      try { return new URL(u).origin === origin; } catch { return false; }
    });
    const run = () =>
      caches.open(RUNTIME).then((c) => Promise.allSettled(same.map((u) => c.add(u).catch(() => null))));
    if (e.waitUntil) e.waitUntil(run());
    else run();
  }
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  /* فونت‌های گوگل: کش دائم */
  if (url.hostname.includes("fonts.googleapis.com") || url.hostname.includes("fonts.gstatic.com")) {
    e.respondWith(
      caches.open(FONTS).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
          return res;
        } catch {
          return hit || Response.error();
        }
      })
    );
    return;
  }

  /* ناوبری: شبکه، با fallback به کش — آفلاین هم باز می‌شود */
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CORE).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  /* بقیه منابع هم‌دامنه: اول کش (سریع‌ترین)، بعد شبکه + کش */
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req)
            .then((res) => {
              if (res && res.ok) {
                const copy = res.clone();
                caches.open(RUNTIME).then((c) => c.put(req, copy));
              }
              return res;
            })
            .catch(() => Response.error())
      )
    );
  }
});
