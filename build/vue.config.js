'use strict'
const path = require("path")
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const renderer = PrerenderSPAPlugin.PuppeteerRenderer;

module.exports = {
    configureWebpack: config =>{
        if(process.env.NODE_ENV === 'production') return;
        // 直接修改webpack配置
        config.externals = {
            'vue':'Vue'
        }
        // 返回需要河滨的webpack配置
        return {
            plugins: [
                new PrerenderSPAPlugin({
                    // 要求给的webpack输出应用程序的路径渲染
                    staticDir: path.join(__dirname,'dist'),
                    // 必须要渲染的路径--对应自己的路由文件
                    routes: ['/',],
                    // 必须，要使用的实际渲染器，没有则不能预编译
                    render:new renderer({
                        inject:{
                            foo:'bar'
                        },
                        headless: false, //渲染时显示浏览器窗口
                        // 等待渲染，直到检测到指定元素
                        renderAfterDocumentEvent: 'render-event'   
                    })
                })
            ]
        }
        
    },
    productionSourceMap:false
}