const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const path = require('path')
const { exec } = require('child_process')

module.exports = {
  entry: {
    main: './src/index.js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['*', '.js', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|ttf)$/,
        loader: 'file-loader',
        options: {
          // publicPath: 'build',
          esModule: false,
        }
      }
    ]
  },
  plugins: [
    {
      apply: (compiler) => compiler.hooks.watchRun.tapAsync('watchRun', (params, cb) => {
        exec('npm run buildnum', (err, stdout, stderr) => {
          if (stdout) process.stdout.write(stdout)
          if (stderr) process.stderr.write(stderr)
          cb()
        })
      })
    },
    new webpack.WatchIgnorePlugin([path.join(__dirname, 'src/buildnum.js')]),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: 'static/index.ejs',
      filename: 'index.html',
      inlineSource: '.(js|css)',
      favicon: './assets/favicon.png',
    }),
    // new HtmlWebpackInlineSourcePlugin(),
  ]
}
