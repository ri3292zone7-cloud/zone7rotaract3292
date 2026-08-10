import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'three', test: /node_modules[\\/](three|@react-three|three-stdlib)/ },
            { name: 'gsap', test: /node_modules[\\/]gsap/ },
            { name: 'pdfjs', test: /node_modules[\\/]pdfjs-dist/ },
            { name: 'pageflip', test: /node_modules[\\/]page-flip/ }
          ]
        }
      }
    }
  }
})
