import {defineConfig} from 'vitest/config';
import {profilerPlugin} from './index.js';

export default defineConfig({
    plugins: [profilerPlugin()],
});
