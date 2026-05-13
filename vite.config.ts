import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react-vendor";
            if (id.includes("lodash")) return "lodash";
            if (id.includes("react-icons")) return "icons";
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("react-toastify")) return "toastify";
            if (id.includes("i18next")) return "i18n";
            return "vendor";
          }
        },
      },
      treeshake: true,
    },
    chunkSizeWarningLimit: 1000,
  },
});
