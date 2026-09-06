import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

/* علامت‌گذاری لودر به‌عنوان سوارشده و پنهان کردن آن */
const boot = document.getElementById("boot");
if (boot) {
  boot.dataset.mounted = "1";
  boot.style.display = "none";
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

/* ثبت service worker برای کارکرد کاملاً آفلاین */
if ("serviceWorker" in navigator && !location.hostname.includes("localhost")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js", { updateViaCache: "none" })
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          if (nw) {
            nw.addEventListener("statechange", () => {
              if (nw.state === "installed" && navigator.serviceWorker.controller) {
                nw.postMessage("SKIP_WAITING");
              }
            });
          }
        });
        /* کش کامل منابع بارگذاری‌شده برای آفلاینِ کامل */
        window.setTimeout(() => {
          const urls = performance
            .getEntriesByType("resource")
            .map((r) => r.name)
            .filter((u) => u.startsWith(location.origin))
            .concat([location.href]);
          reg.active?.postMessage({ type: "PRECACHE", urls: [...new Set(urls)] });
        }, 1500);
      })
      .catch(() => { /* بدون SW هم با کش مرورگر کار می‌کند */ });
  });
}
