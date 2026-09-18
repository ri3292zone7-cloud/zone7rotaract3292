import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/React%20JS/dist-newroadcity/',
  publicDir: false,
  build: {
    outDir: 'dist-newroadcity',
    emptyOutDir: true,
    rollupOptions: {
      input: 'newroadcity.html'
    }
  }
})