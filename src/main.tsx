import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

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

/* Service worker: بعد از اولین بارگذاری، برنامه کاملاً آفلاین می‌شود */
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
      })
      .catch(() => { /* کش مرورگر همچنان کمک می‌کند */ });
  });
}
