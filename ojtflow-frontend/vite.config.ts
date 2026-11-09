
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, statSync } from 'node:fs';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), 'src');

function collectHtml(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = resolve(dir, name);

    if (name === '_dev') return [];

    if (statSync(full).isDirectory()) {
      return collectHtml(full);
    }

    return full.endsWith('.html') ? [full] : [];
  });
}

export default defineConfig({
  root,
  publicDir: resolve(root, '../public'),
  envDir: resolve(root, '..'),
  server: {
    port: 5173,
    open: '/index.html'
  },
  build: {
    outDir: resolve(root, '../dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: collectHtml(root)
    }
  }
});
