export function profilerPlugin() {
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