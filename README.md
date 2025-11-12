# vitest-profiler-plugin

A Vitest plugin to profile test execution time.

## Installation

```bash
pnpm install -D vitest-profiler-plugin
```

## Usage

Add the plugin to your `vitest.config.js` file:

```javascript
import { defineConfig } from 'vitest/config'
import {profilerPlugin} from 'vitest-profiler-plugin'

export default defineConfig({
  plugins: [
    profilerPlugin(),
  ]
})
```

## What it does

This plugin uses the `v8-profiler-next` library to generate CPU profiles for your tests.

For each test, a `.cpuprofile` file is generated in the `test-profile` directory. The file path mirrors the test file path and the test's suite structure.

## Viewing the profiles

To examine the generated profile:

1.  Open Chrome and navigate to `chrome://inspect`.
2.  Click "Open dedicated DevTools for Node".
3.  Select the "Performance" tab.
4.  Click "Load profile" and import your `.cpuprofile` file.

## License

[MIT](LICENSE)
