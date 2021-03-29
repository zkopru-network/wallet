const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')
// const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    // new VueSSRClientPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    publicPath: '/',
    compress: true,
    historyApiFallback: {
      rewrites: [{ from: /^\/[0-9A-Za-z-/]+$/, to: '/index.html' }],
      index: 'index.html',
    },
  },
})
