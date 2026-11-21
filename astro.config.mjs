// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://itaka.space',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
