import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/React%20JS/dist-store/',
  assetsInclude: ['**/*.glb', '**/*.mp4'],
  publicDir: false,
  build: {
    outDir: 'dist-store',
    emptyOutDir: true,
    rollupOptions: {
      input: 'store-standalone.html'
    }
  }
})