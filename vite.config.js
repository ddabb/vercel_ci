import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

export default defineConfig({
  plugins: [
    nodePolyfills({
      include: ['path', 'fs', 'util', 'stream', 'constants', 'assert'], // 重新包含fs模块
      globals: { 
        Buffer: true,
        process: true  // 添加process全局变量
      }
    }),
    uni()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 添加路径别名
    }
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 4096 // 调整资源内联阈值
  }
})