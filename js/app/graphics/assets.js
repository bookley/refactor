define([], function(){
    function Assets(urls) {
        this.urls = urls;
        this.assets = [];

        /**
         *
         * @param url The url to fire the ajax request to
         * @returns {Promise} Called when the asset file has been downloaded
         * @constructor
         */
        this.GetFile = function(url){
            var promise = new Promise(function(resolve, reject){
                var request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.onreadystatechange = function(){
                    if(request.readyState == 0 || request.readyState==4){
                        if(request.status == 200){
                            resolve(request.responseText);
                        } else {
                            reject(request.status + " " + request.responseText);
                        }
                    }
                }
                request.send();
            });
            return promise;
        }

        this.GetAsset = function(url, name, type){
            var self = this;
            var promise = new Promise(function(resolve, reject){
                self.GetFile(url).then(function(data){
                    self.assets[name] = {
                        data: data,
                        name: name,
                        type: type
                    };
                    resolve();
                });
            })
            return promise;
        }
    }

    Assets.prototype.Load = function(){
        var promises = [];
        for(var i = 0; i < this.urls.length; i++){
            promises.push(this.GetAsset(this.urls[i].url, this.urls[i].name, this.urls[i].type));
        }

        var loadingPromise = Promise.all(promises).then(function(){
            console.log("All assets loaded");
        }).catch(function(){
            console.log("Failed to load assets");
        });
        return loadingPromise;
    }

    Assets.prototype.Asset = function(assetName){
        return this.assets[assetName];
    }

    Assets.prototype.GetByType = function(type){
        var results = [];
        var keys = Object.keys(this.assets);
        for(var i = 0; i < keys.length; i++){
            console.log(this.assets[keys[i]]);
            if(this.assets[keys[i]].type == type) results.push(this.assets[keys[i]]);
        }

        return results;
    }

    return Assets;
});