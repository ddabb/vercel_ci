import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  base: './', // 添加这行确保静态资源路径正确
  plugins: [
    uni(),
  ],
})
