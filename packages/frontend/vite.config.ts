import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import { svgPlugin } from "vite-plugin-fast-react-svg";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgPlugin(), react()],
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  resolve: {
    alias: [{
      find: "@",
      replacement: resolve(__dirname, "src"),
    }],
  },
});
