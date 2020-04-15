// vue-cli3 只需要配置vue.config.js就行，
// 它会把不用的插件隐藏起来，需要配置什么插件只需要在本文件夹下加即可
const path = require("path");
const PrerenderSpaPlugin = require("prerender-spa-plugin");
const Renderer = PrerenderSpaPlugin.PuppeteerRenderer;

function resolve (dir) {
    //此处使用path.resolve 或path.join 可自行调整
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath:"/",
    assetsDir: 'public',
    lintOnSave: false,
    productionSourceMap:false,
    
    configureWebpack:(config) => {

        config.resolve.alias['@asset'] = resolve('src/assets');
        config.resolve.alias['@components'] = resolve('src/components');
        config.resolve.alias['@src'] = resolve('src');
        config.resolve.alias['@mixins'] =  resolve('src/mixins');
        config.resolve.alias['@pages'] =  resolve('src/pages');
        config.resolve.alias['@public'] =  path.resolve(__dirname, "./public");

        if(process.env.NODE_ENV !== "development"){
            // config.externals = {
            //     'vue': 'Vue',  // vue不打包到chunk-vendors包中, 但public/index.html中要静态引入vue的js文件
            //     // 'vue-router': 'VueRouter',
            // };
            let plugins = [
                new PrerenderSpaPlugin({
                    staticDir: path.join(__dirname, "dist"),
                    outputDir: path.join(__dirname, "dist"),
                    indexPath: path.join(__dirname, "dist", "index.html"),
                    routes: [ '/', '/about-us'],
                    postProcess (renderedRoute) {
                        renderedRoute.route = renderedRoute.originalRoute
                        renderedRoute.html = renderedRoute.html.split(/>[\s]+</gmi).join('><')
                        if (renderedRoute.route.endsWith('.html')) {
                            renderedRoute.outputPath = path.join(__dirname, 'dist', renderedRoute.route)
                        }

                        return renderedRoute
                    },

                    renderer: new Renderer({
                        injectProperty: '__PRERENDER_INJECTED',
                        inject: {
                            foo: 'bar'
                        },
                        renderAfterDocumentEvent: 'custom-render-trigger',
                        renderAfterTime: 5000, // Wait 5 seconds.
                        headless: false // Display the browser window when rendering. Useful for debugging.
                    })
                })
            ];
            config.plugins = [...config.plugins, ...plugins];
        }
    }
};
