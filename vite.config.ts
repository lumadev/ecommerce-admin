import react from "@vitejs/plugin-react-swc";

import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    open: true,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": `${import.meta.dirname}/src`,
    },
  },
}));
