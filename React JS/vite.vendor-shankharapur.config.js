import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/React%20JS/dist-vendor-shankharapur/',
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.webp'],
  publicDir: false,
  build: {
    outDir: 'dist-vendor-shankharapur',
    emptyOutDir: true,
    rollupOptions: {
      input: 'vendor-shankharapur.html'
    }
  }
})