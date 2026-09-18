import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/React%20JS/dist-kathmanduheight/',
  publicDir: false,
  build: {
    outDir: 'dist-kathmanduheight',
    emptyOutDir: true,
    rollupOptions: {
      input: 'kathmanduheight-demo.html'
    }
  }
})