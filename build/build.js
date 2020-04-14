'use strict'
require('./check-versions')()   //检查Node和npm版本

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require("path")
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')


const spinner = ora('build for production...')
spinner.start()

// 拼接编译输出文件路径
rm(path.join(config.build.assetsRoot, config.build.asstsSubDirectory), err=>{
    if(err) throw err
    webpack(webpackConfig, function(err, stats){
        spinner.stop()
        if(err) throw err
        process.stdout.write(stats.toString({
            colors:true,
            modules:false,
            children:false,
            chunks:false,
            chunkModules:false
        }) + '\n\n')
        if(stats.hasErrors()) {
            console.log(chalk.red(' build failed with errors.\n'))
            process.exit(-1)
        }
        console.log(chalk.cyan('build complete.\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
})

