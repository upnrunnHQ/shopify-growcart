const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './../extensions/amortizable-growth-ext/assets'),
    filename: 'growcart.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin()
  ],
  resolve: {
    alias: {
      api: path.resolve(__dirname, 'api/'),
      components: path.resolve(__dirname, 'components/'),
      hooks: path.resolve(__dirname, 'hooks/'),
      lib: path.resolve(__dirname, 'lib/'),
      svg: path.resolve(__dirname, 'svg/'),
    },
  },
};

module.exports = config;