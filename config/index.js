"use strict"

// 

const path = require("path");
module.exports = {
    build: {
        // 使用config/prod.env.js 中定义的编译环境
        env:require("./prod.env"),
        // 编译输入的index.html 文件
        index: path.resolve(__dirname,"../dist/index.html"),
        // 编译输出的静态资源路径
        assetsRoot:path.resolve(__dirname,"../dist"),
        // 编译输出的二级目录
        asstsSubDirectory:"static",
        // 编译发布的根目录，可配置位资源服务器域名或cdn域名
        assetsPublicPath:"/",
        // 是否开启cssSourceMap
        productionSourceMap: false,
        // 是否开启gzip
        productionGzip: false,
        productionGzipExtensions:["js","css" ]
    },
    dev:{
        env:require('./dev.env'),  // 使用config/dev.env.js 中定义的编译环境
        port:process.env.PORT || 8060,   // 运行测试页面的端口
        autoOpenBrowser: true,    // 自动打开浏览器
        assetsSubDirectory: "static",     // 编译输出的二级目录
        assetsPublicPath:'/',     // 编译发布的根目录，可配置位资源服务器域名或cdn域名
        proxyTable : {   // 需要proxyTable 代理的接口
            "/api": {
                target: 'http://www.baidu.com/api/',   //请求地址
                changeOrigin: true,   // 项目内url可以跨域
                // secure: false,  // 如果是https接口，需要配置这个参数
                // ws:true,    //是否代理websocket
                // onProxyRes:onProxyRes,  //代理响应事件
                 //  匹配接口地址是否有“/api”，
                pathRewrite: {
                    "^/api":''
                }
            }
        },
        cssSourceMap: false
    }
}