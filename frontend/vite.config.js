import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name(id) {
                const path = id.replaceAll('\\', '/')
                if (path.includes('/node_modules/@firebase/firestore/'))
                  return 'firestore'
                if (path.includes('/node_modules/@firebase/auth/'))
                  return 'firebase-auth'
                if (path.includes('/node_modules/@firebase/'))
                  return 'firebase-core'
                if (
                  /\/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(
                    path,
                  )
                )
                  return 'react'
                return null
              },
            },
          ],
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'icons.svg', 'icons/app.svg'],
      manifest: {
        name: 'SPLIT — Registro de entrenamientos',
        short_name: 'SPLIT',
        description:
          'Dashboard deportivo para registrar actividades, sueño y progreso',
        theme_color: '#101110',
        background_color: '#101110',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'es',
        icons: [
          {
            src: '/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/wger\.de\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'wger-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})
