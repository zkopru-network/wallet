const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new VueSSRClientPlugin(),
  ],
})
