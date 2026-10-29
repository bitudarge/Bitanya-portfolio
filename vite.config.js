import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  build: {
    rollupOptions: {
      // Two pages: the portfolio, and the lightweight /connect page the
      // NFC tag opens.
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        connect: fileURLToPath(new URL("./connect/index.html", import.meta.url)),
      },
    },
  },
});
