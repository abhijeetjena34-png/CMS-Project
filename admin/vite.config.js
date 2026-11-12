import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const required = ['VITE_API_BASE_URL', 'VITE_PUBLIC_URL'];
  const missing = required.filter((name) => !env[name]);

  if (mode === 'production' && missing.length) {
    throw new Error(`Missing required production environment variable(s): ${missing.join(', ')}`);
  }

  return {
    plugins: [react()],
  };
})
