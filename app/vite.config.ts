import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El base path se ajusta al subdirectorio de GitHub Pages en el build de CI
// (VITE_BASE=/SEKstructures/) y queda en '/' para desarrollo local.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
});
