import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/React%20JS/dist-sankhu/',
  publicDir: false,
  build: {
    outDir: 'dist-sankhu',
    emptyOutDir: true,
    rollupOptions: {
      input: 'sankhu-demo.html'
    }
  }
})