import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  define: {
    global: "globalThis",
  },
  plugins: [
    react(),
    laravel({
      input: ["resources/js/main.tsx"],
      refresh: true,
    }),
  ],
  resolve: {
    alias: {
      "@": "/resources/js",
      "@@": "/resources/js/components",
      "@pages": "/resources/js/pages",
    },
  },
  build: {
    // Split long-lived vendor code from app code so a content change does
    // not invalidate the whole bundle in visitors' caches.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          editor: [
            "draft-js",
            "react-draft-wysiwyg",
            "draftjs-to-html",
            "html-to-draftjs",
          ],
          particles: [
            "@tsparticles/engine",
            "@tsparticles/react",
            "@tsparticles/slim",
          ],
        },
      },
    },
  },
});
