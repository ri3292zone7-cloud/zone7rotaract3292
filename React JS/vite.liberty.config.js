import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/React%20JS/dist-liberty/',
  publicDir: false,
  build: {
    outDir: 'dist-liberty',
    emptyOutDir: true,
    rollupOptions: {
      input: 'liberty-demo.html'
    }
  }
})