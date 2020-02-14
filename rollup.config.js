import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
    {
      name: 'Thingworx',
      file: pkg.browser,
      format: 'umd',
    },
    {
      name: 'Thingworx',
      file: pkg.browser.replace(/\.js$/, '.min.js'),
      format: 'umd',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
};
