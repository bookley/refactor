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

var server = app.listen(3000, function(){
    console.log("Server started on port 3000");
});



var compiler = webpack(webpackConfig);
var server = new WebpackDevServer(compiler, {
    // webpack-dev-server options

    contentBase: "./dist/",
    // Can also be an array, or: contentBase: "http://localhost/",

    hot: false,

    historyApiFallback: false,
    clientLogLevel: "info",
    // Control the console log messages shown in the browser when using inline mode. Can be `error`, `warning`, `info` or `none`.

    // webpack-dev-middleware options
    quiet: false,
    noInfo: false,
    lazy: false,
    filename: "bundle.js",
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    // It's a required option.
    //publicPath: "dist",
    stats: { colors: true }
});
server.listen(8000, "localhost", function(er) {
    if(er) console.log(er);
    else console.log("Dev server running on 8000")
});