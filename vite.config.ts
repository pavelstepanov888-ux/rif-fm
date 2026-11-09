import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const { VITE_BASE_PATH = '/' } = loadEnv(mode, '.', 'VITE_');
  return {
    plugins: [react()],
    base: VITE_BASE_PATH.endsWith('/') ? VITE_BASE_PATH : `${VITE_BASE_PATH}/`,
  };
});
