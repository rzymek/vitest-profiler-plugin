import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function plugin() {
    return {
        name: 'vitest-profiler-plugin',
        configureVitest(context) {
            if(process.env.VITEST_PROFILER_DISABLE) {
                return;
            }
            context.project.globalConfig.setupFiles.push(__dirname + '/vitest-profiler-plugin.js');
        },
    };
}
