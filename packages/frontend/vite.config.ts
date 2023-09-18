import react from "@vitejs/plugin-react";
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
        rewrite: (path) => path.replace(/^\/api\/v1/, "/api"),
        secure: false,
        ws: true,
      },
    },
  },
});
