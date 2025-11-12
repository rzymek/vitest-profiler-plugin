import { defineConfig } from 'vitest/config';
import profiler from './index.js';

export default defineConfig({
  plugins: [profiler()],
});
