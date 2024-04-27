import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    define: {
      'process.env.NODE_DEBUG': false
    },
    plugins: [
      react(),
      nodePolyfills(),
    ],
  }
})
