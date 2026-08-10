import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  assetsInclude: ['**/*.pdf', '**/*.glb'],
  publicDir: false,
  build: {
    outDir: 'dist-merch',
    emptyOutDir: true,
    rollupOptions: {
      input: 'merch-standalone.html'
    }
  }
})
