import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/React%20JS/dist-vendors/',
  assetsInclude: ['**/*.mp4', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.webp'],
  publicDir: false,
  build: {
    outDir: 'dist-vendors',
    emptyOutDir: true,
    rollupOptions: {
      input: 'vendors-react.html'
    }
  }
})