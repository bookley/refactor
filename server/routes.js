var express = require('express');
var router = express.Router();
var path = require("path");

var assetLoader = require("./assetLoader");

router.get("/", function(req, res){
    res.sendFile(path.resolve(".") + '/index.html');
});

router.get("/assets", function(req, res){
    assetLoader.getAssetsJSON(function(assetsJSON){
        res.send(JSON.stringify(assetsJSON));
    });
});

module.exports = router;