import { rspack } from '@rspack/core';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  entry: path.join(__dirname, 'src', 'index.tsx'),
  experiments: {
    css: true,
  },
  output: {
    clean: true,
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: path.join('src', 'index.html'),
    }),
    new rspack.CopyRspackPlugin({
      patterns: [
        { from: 'data', to: 'audio' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(flac|mp3|mp4|m4a|opus|wav)$/,
        type: 'asset/resource'
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
            },
          },
        },
        type: 'javascript/auto',
      },
    ],
  },
};
