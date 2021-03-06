const path = require('path')
const execa = require('execa')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackAutoInject = require('webpack-auto-inject-version')
const ChromeReloadPlugin = require('wcer')
const { resolve, page, assetsPath } = require('./util')

var gitHash = execa.sync('git', ['rev-parse', '--short', 'HEAD']).stdout
console.log('gitHash:', gitHash)
module.exports = {
  entry: {
    popup: resolve('src/popup.js'),
    prompt: resolve('src/prompt.js'),
    content: resolve('src/content.js'),
    inject: resolve('src/inject.js'),
    background: resolve('src/background.js')
  },
  output: {
    path: resolve('dist'),
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.sass$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
            sass: [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve('src')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    page({
      title: 'popup title',
      name: 'popup',
      chunks: ['popup']
    }),
    page({
      title: 'options title',
      name: 'options',
      chunks: ['options']
    }),
    page({
      title: '转账',
      name: 'prompt',
      chunks: ['prompt']
    }),
    new CopyWebpackPlugin([
      {
        from: resolve('static')
      }
    ]),
    new ChromeReloadPlugin({
      port: 23333,
      manifest: resolve('src/manifest.js')
    }),
    new webpack.DefinePlugin({
      'version.hash': JSON.stringify(gitHash)
    }),
    new WebpackAutoInject({
      PACKAGE_JSON_PATH: './package.json',
      components: {
        AutoIncreaseVersion: true
      },
      componentsOptions: {
        AutoIncreaseVersion: {
          runInWatchMode: false // it will increase version with every single build!
        }
      }
    })
  ],
  performance: {
    hints: false
  }
}
