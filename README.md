# vitest-profiler-plugin

A [vitest](https://vitest.dev/) plugin to profile test execution time.

## Installation

```bash
npm install --save-dev vitest-profiler-plugin
```

## Usage

Add the plugin to your `vitest.config.js` file:

```javascript
import { defineConfig } from 'vitest/config';
import profiler from 'vitest-profiler-plugin';

export default defineConfig({
  plugins: [profiler()],
});
```

Then run vitest as usual. The execution time for each test will be printed to the console.

## License

ISC
