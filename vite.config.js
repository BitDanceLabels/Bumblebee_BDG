
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: [
//       { find: '~', replacement: '/src' }
//     ]
//   },
//   envPrefix: 'VITE_', // Chỉ định prefix để Vite nạp các biến môi trường
//   // server: {
//   //   port: 3000, // Cấu hình cổng server phát triển
//   // },
//   build: {
//     outDir: 'dist', // Cấu hình thư mục đầu ra
//   }
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  },
  envPrefix: 'VITE_', // Chỉ định prefix để Vite nạp các biến môi trường
  build: {
    outDir: 'dist', // Cấu hình thư mục đầu ra
  },
  optimizeDeps: {
    exclude: ['date-fns'], // Loại trừ date-fns khỏi tối ưu hóa
  },
});