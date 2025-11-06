import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],

  // 👇 Automatically use the right base depending on environment
  base: command === "build" ? "/gemini-seo-builder/" : "/",

  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000", // Works only in local dev mode
    },
  },

  build: {
    outDir: "dist", // Default but good to include explicitly
    chunkSizeWarningLimit: 1000, // Avoids large chunk warnings
  },
}));
