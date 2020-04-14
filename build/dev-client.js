'use strict'
require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/clinet?noInfo=true&reload=true')

hotClient.subscribe(function (event){
    if (event.action === 'reload'){
        window.location.reload()
    }
})