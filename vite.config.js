import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DreamWorld',
        short_name: 'DW',
        description: 'DreamWorld Portal',
        start_url: '/portal',
        display: 'standalone',
        theme_color: '#141932',
        background_color: '#0d1326',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    allowedHosts: [
      'localhost',
      '.ngrok-free.app',
      '.ngrok.io'
    ]
  }
})
