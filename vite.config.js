import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // مسیرهای نسبی تا برنامه در هر زیرمسیر/هاستی بدون صفحه‌ی سفید اجرا شود
  base: "./",
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
  },
  build: {
    chunkSizeWarningLimit: 900,
  },
});
