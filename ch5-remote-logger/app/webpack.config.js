const path = require("path");
const webpack = require("webpack");

const baseConfig = {
  entry: path.join(__dirname, './src/index.tsx'),
  mode: 'development',
  node: {
    fs: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: ["node_modules"],
        loader: "ts-loader",
        options: {
          configFile: path.resolve(__dirname, './tsconfig.json')
        }
      },
      {
        test: /\.css$/,
        loader: [
          'style-loader',
          'css-loader'
        ],
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: path.join(__dirname, './public/'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.css']
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    publicPath: "http://127.0.0.1:3000/public/",
    port: 3000,
  },
}

const bundleForApi = Object.assign({}, baseConfig, {
  output: {
    path: path.resolve(__dirname, '../api/public'),
    filename: 'bundle.js'
  },
});

module.exports = [
  baseConfig,
  bundleForApi,
]