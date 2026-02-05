import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';
import { imageOptimizer } from './astro-image-optimizer.js';

export default defineConfig({
  integrations: [
    react(),
    imageOptimizer(),
  ],
  vite: {
    plugins: [tailwind()],
  },
});
