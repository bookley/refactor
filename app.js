process.on('uncaughtException', function (exception) {
    console.log(exception); // to see your exception details in the console
    // if you are on production, maybe you can send the exception details to your
    // email as well ?
});

process.on('exit', function(code){
    console.log("About to exit with code: " + code);
});

var express = require("express");
var fs = require("fs");
var path = require("path");
var routes = require("./server/routes");
var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config");

var app = express();
app.use('/dist', express.static('dist'));
app.use('/client', express.static('client'));
app.use('/assets', express.static('assets'));
app.use("/", routes)

var compiler = webpack(webpackConfig);
var bundleStart = null;
compiler.plugin('compile', function() {
    console.log('Bundling...');
    bundleStart = Date.now();
});
// We also give notice when it is done compiling, including the
// time it took. Nice to have
compiler.plugin('done', function() {
    console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
});


var devServer = new WebpackDevServer(compiler, {
    // webpack-dev-server options

    contentBase: "http://localhost:8000/",
    // Can also be an array, or: contentBase: "http://localhost/",

    hot: false,
    historyApiFallback: false,
    clientLogLevel: "info",
    // Control the console log messages shown in the browser when using inline mode. Can be `error`, `warning`, `info` or `none`.

    // webpack-dev-middleware options
    quiet: false,
    noInfo: false,
    filename: "bundle.js",
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    // It's a required option.
    //publicPath: "dist",
    stats: { colors: true }
});

devServer.listen(8000, "localhost", function() {
    console.log("Dev server running on 8000")
});


app.listen(3000, function(){
    console.log("Server started on port 3000");
});
