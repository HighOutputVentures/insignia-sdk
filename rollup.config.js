// uglify handles only es5 code, so this also acts as smoke test against shipping es2015+ syntax
import { uglify } from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript2';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from '@rollup/plugin-json';
import tsc from 'typescript';

const config = {
  input: 'src/browser/index.ts',
  output: {
    format: process.env.ROLLUP_FORMAT,
    exports: 'named',
    name: 'insignia',
    globals: {
      fetch: 'fetch',
      'url-parse': 'Url',
    },
  },
  external: ['url-parse'],
  plugins: [
    json(),
    typescript({
      typescript: tsc,
      tsconfig: 'tsconfig.rollup.json',
    }),
    builtins(),
    globals(),
    resolve({ preferBuiltins: true, browser: true }),
    commonjs(),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
      warnings: false,
    }),
  );
}

module.exports = config;
