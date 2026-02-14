import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 使得 process.env.API_KEY 在客户端代码中可用
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      rollupOptions: {
        // 告诉 Vite 不要打包这些库，因为它们通过 index.html 的 importmap 从 CDN 加载
        external: ['@google/genai', 'react', 'react-dom', 'lucide-react']
      }
    }
  }
})