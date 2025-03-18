import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    port: 3000, // 强制前端使用3000端口
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 统一代理到本机3000端口
        changeOrigin: true
      }
    }
  }
})
