import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: process.env.CI ? 'https://cronize.mtlh.dev' : 'http://localhost:4321',
  integrations: [react(), tailwind({
    applyBaseStyles: false
  })],
  output: "server",
  adapter: vercel(),
  prefetch: true
});