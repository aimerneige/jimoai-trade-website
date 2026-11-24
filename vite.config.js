import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' 让 dist 可以部署在任意子路径，或直接本地打开
export default defineConfig({
  base: './',
  plugins: [react()],
})
