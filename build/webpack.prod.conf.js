'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env
// 合并基础的webpack配置
const webpackConfig = mege(baseWebpackConfig, {
  // 配置样式文件的处理规则，使用styleLoaders
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  // 开启source-map，生产环境下推荐使用cheap-source-map或source-map，后者得到的.map文件体积较大，但是能够完全还原以前的js代码
  devtool: config.build.productionSourceMap ? '#source-map' : false,

  output: {
    
    path: config.build.assetsRoot,   // 编译的输出目录
    filename: utils.assetsPath('js/[name].[chunkhash].js'),     //编译输出文件名格式
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')     //没有指定输出名的文件输出的文件名格式
  },
  vue: {   //vue 里的css单独提取出来
    loaders: utils.cssLoaders({
      sourceMap: config.build.assetsRoot,   //编译输出目录
      extract: true
    })
  },
  // 重新配置插件项
  plugins: [
    // 位于开发环境下
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
    // 丑化压缩代码
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    // 抽离Css文件
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // filename生成网页的html名字, 可以使用/来控制文件的目录
    //最终生成的路径是基于webpack配置的output.path
    new HtmlWebpackPlugin({
      // 生成html文件的名字，路径和生产环境下的不同，要与修改后的publicPAth相结合，否则开启服务器后也买你空白
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
        // 源文件，路径相对于本文件所在的位置
      template: 'index.html',
      // 要把<script>标签插入到哪个标签里（body|true|head|false)
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // split vendor js into its own file
    // 如果文件时多入口的文件，可能存在，重复代码，把公共代码提取处理，不会重复下载公共代码了
    // name:这个给公共代码的chunk唯一标识
    // filename，如何命名打包后生产的js文件，
    // minChunks，公共代码的判断标准：某个js模块被多少个chunk加载了才算是公共代码
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块
    // 并为他们分配最小的ID
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})
// gzip模式下需要引入compression插件进行压缩
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
