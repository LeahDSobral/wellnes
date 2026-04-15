import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set base to your GitHub repo name, e.g. '/sanara-icu-stt/'
// Change this to match your repo: https://github.com/USERNAME/REPO-NAME
const GITHUB_REPO_NAME = '/wellnes/';

export default defineConfig({
  base: GITHUB_REPO_NAME,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});