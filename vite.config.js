import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Backend URL: from env var, or default to localhost
  const apiTarget = env.VITE_API_URL || 'http://localhost:8000';

  return {
    plugins: [
      react(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src/pwa',
        filename: 'serviceWorker.js',
        registerType: 'autoUpdate',
        includeAssets: ['pwa-192.png', 'pwa-512.png', 'pwa-512-maskable.png', 'apple-touch-icon.png'],
        manifest: {
          name: 'Blood Donation & SOS',
          short_name: 'Blood SOS',
          description: 'Connect with blood donors near you for donation and emergency requests.',
          theme_color: '#B91C1C',
          background_color: '#FFFFFF',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          icons: [
            { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
            {
              src: 'pwa-512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],

    server: {
      host: '0.0.0.0',
      port: 5173,
      // Proxy all /api and /health calls to the FastAPI backend.
      // This makes the browser think everything is on the same origin,
      // which also unblocks navigator.geolocation on plain HTTP LAN.
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/health': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
