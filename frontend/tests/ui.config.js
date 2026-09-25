import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
const fake = fileURLToPath(new URL('./fakeFirebase.js', import.meta.url))
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ui-test-pwa',
      resolveId(id) {
        if (id === 'virtual:pwa-register/react') return '\0test-pwa'
      },
      load(id) {
        if (id === '\0test-pwa')
          return 'export const useRegisterSW=()=>({needRefresh:[false,()=>{}],updateServiceWorker:()=>{}})'
      },
    },
  ],
  resolve: {
    alias: [
      { find: 'firebase/app', replacement: fake },
      { find: 'firebase/auth', replacement: fake },
      { find: 'firebase/firestore', replacement: fake },
    ],
  },
  server: { host: '127.0.0.1', port: 5175, strictPort: true },
})
