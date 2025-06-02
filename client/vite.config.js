// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// //import vitePluginRequire from "vite-plugin-require";
// //import { defineConfig } from 'vite';
// //import commonjs from '@rollup/plugin-commonjs';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     minify: false,
//   },

//   server: {
//     proxy: {
//       "/api": "http://localhost:3001",
//     },
//   },
//   mimeTypes: {
//     ".js": "text/plain",
//   },
// });


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     minify: false,
//   },
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:3001",
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/api/, "/api"),
//         configure: (proxy, options) => {
//           proxy.on("proxyReq", (proxyReq, req, res) => {
//             proxyReq.setHeader("origin", "http://localhost:5173");
//           });
//         }
//       },
//     },
//     cors: {
//       origin: "http://localhost:5173",
//       credentials: true,
//     },
//   },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            // Set Origin header to your frontend origin to avoid CORS issues
            proxyReq.setHeader("origin", "http://localhost:5173");
          });
        },
      },
    },
    cors: {
      origin: "http://localhost:5173",  // Frontend origin allowed
      credentials: true,                // Allow credentials (cookies, auth headers)
    },
  },
});
