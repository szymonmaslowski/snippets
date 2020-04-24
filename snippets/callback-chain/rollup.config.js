import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  output: {
    file: 'lib/callback-chain.js',
    format: 'cjs',
  },
};
