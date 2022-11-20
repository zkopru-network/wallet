const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = merge(common, {
  mode: 'development',
  plugins: [new Dotenv()],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    publicPath: '/',
    compress: true,
    historyApiFallback: {
      rewrites: [{ from: /^\/[0-9A-Za-z-/]+$/, to: '/index.html' }],
      index: 'index.html',
    },
  }
})
