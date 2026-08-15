import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/React%20JS/dist-vendor-mannka/',
  assetsInclude: ['**/*.mp4', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.webp'],
  publicDir: false,
  build: {
    outDir: 'dist-vendor-mannka',
    emptyOutDir: true,
    rollupOptions: {
      input: 'vendor-mannka.html'
    }
  }
})