// eslint-disable-next-line max-len
/* eslint-disable unicorn/prefer-node-protocol, unicorn/import-style, unicorn/prefer-module, import/no-import-module-exports */

import { resolve } from 'path';
import nodeExternals from 'webpack-node-externals';

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.production.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@localTypes': resolve(__dirname, 'types'),
      '@src': resolve(__dirname, 'src'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
  output: {
    path: resolve(__dirname, './build/src'),
    filename: 'index.js',
    libraryTarget: 'commonjs',
  },
};
