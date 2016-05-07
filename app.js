var express = require("express");
var fs = require("fs");
var path = require("path");
var routes = require("./server/routes");

var app = express();
app.use('/client', express.static('client'));
app.use('/assets', express.static('assets'));
app.use("/", routes)

var server = app.listen(3000, function(){
    console.log("Server started on port 3000");
});