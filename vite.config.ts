import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: "/english-tuning/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/oauth2": {
        target: "https://georgianne-unrejoiced-takingly.ngrok-free.dev",
        changeOrigin: true,
      },
      "/api": {
        target: "https://georgianne-unrejoiced-takingly.ngrok-free.dev",
        changeOrigin: true,
      },
    },
  },
});
