var fs = require("fs");

var assetLoader = {
    getAssetsJSON: function(listener){
        fs.readDir
        listener({
           blah: "bloh"
        });
    }
}

module.exports = assetLoader;