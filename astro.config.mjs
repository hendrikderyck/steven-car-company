import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  // Static site generation - no adapter means only client folder in build
  // API routes will only work in dev mode (npm run dev)
  // For production static hosting, API routes won't work
  output: 'static',
  integrations: [react()],
  vite: {
    plugins: [tailwind()],
  },
});
