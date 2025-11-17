// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // --- ADICIONE ESTE BLOCO ---
  // Isso conecta o frontend ao backend
  server: {
    proxy: {
      // Qualquer chamada que o frontend fizer para '/api'
      '/api': {
        // Será redirecionada para o seu Spring Boot
        target: 'http://localhost:8080',
        
        // Necessário para o backend aceitar a chamada
        changeOrigin: true, 
      }
    }
  }
})