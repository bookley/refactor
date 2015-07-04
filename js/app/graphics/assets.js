define(["require", "exports"], function (require, exports) {
    var Asset = (function () {
        function Asset(data, name, type) {
            this.data = data;
            this.name = name;
            this.type = type;
        }
        return Asset;
    })();
    exports.Asset = Asset;
    var AssetLoader = (function () {
        function AssetLoader(urls) {
            this.urls = urls;
            this.assets = [];
        }
        /**
         *
         * @param url The url to fire the ajax request to
         * @returns {Promise} Called when the asset file has been downloaded
         * @constructor
         */
        AssetLoader.prototype.resolveFile = function (url) {
            var promise = new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.onreadystatechange = function () {
                    if (request.readyState == 0 || request.readyState == 4) {
                        if (request.status == 200) {
                            resolve(request.responseText);
                        }
                        else {
                            reject(request.status + " " + request.responseText);
                        }
                    }
                };
                request.send();
            });
            return promise;
        };
        AssetLoader.prototype.resolveAsset = function (url, name, type) {
            var self = this;
            var promise = new Promise(function (resolve, reject) {
                self.resolveFile(url).then(function (data) {
                    self.assets[name] = new Asset(data, name, type);
                    console.log("Resolved asset " + name);
                    resolve();
                });
            });
            return promise;
        };
        AssetLoader.prototype.resolveImage = function (url, name, type) {
            var self = this;
            var promise = new Promise(function (resolve, reject) {
                var image = new Image();
                image.onload = function () {
                    console.log("image loaded");
                    self.assets[name] = new Asset(image, name, type);
                    resolve();
                };
                image.src = url;
            });
            return promise;
        };
        AssetLoader.prototype.loadAll = function () {
            var promises = [];
            for (var i = 0; i < this.urls.length; i++) {
                if (this.urls[i].type != "texture")
                    promises.push(this.resolveAsset(this.urls[i].url, this.urls[i].name, this.urls[i].type));
                else
                    promises.push(this.resolveImage(this.urls[i].url, this.urls[i].name, this.urls[i].type));
            }
            var loadingPromise = Promise.all(promises).then(function () {
                console.log("All _textureAssets loaded");
            }).catch(function () {
                console.log("Failed to load _textureAssets");
            });
            return loadingPromise;
        };
        AssetLoader.prototype.getAsset = function (assetName) {
            return this.assets[assetName];
        };
        AssetLoader.prototype.getByType = function (type) {
            var results = [];
            var keys = Object.keys(this.assets);
            for (var i = 0; i < keys.length; i++) {
                if (this.assets[keys[i]].type == type)
                    results.push(this.assets[keys[i]]);
            }
            return results;
        };
        return AssetLoader;
    })();
    exports.AssetLoader = AssetLoader;
});
//# sourceMappingURL=assets.js.map