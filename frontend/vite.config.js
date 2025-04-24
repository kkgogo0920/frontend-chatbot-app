import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'node-fetch': 'isomorphic-fetch',
    },
  },
  optimizeDeps: {
    include: ['openai', 'pdfjs-dist', 'react-dropzone'],
  },
  server: {
    host: true,
  },
})
