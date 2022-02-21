// @ts-nocheck
const { resolve } = require('path');
import nodeExternals from 'webpack-node-externals';

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
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