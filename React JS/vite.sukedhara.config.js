import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/React%20JS/dist-sukedhara/',
  publicDir: false,
  build: {
    outDir: 'dist-sukedhara',
    emptyOutDir: true,
    rollupOptions: {
      input: 'sukedhara.html'
    }
  }
})
