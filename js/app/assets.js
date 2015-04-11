define([], function(){
    function Assets(urls) {
        this.urls = urls;
        this.assets = [];

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

        this.GetAsset = function(url, name){
            var self = this;
            var promise = new Promise(function(resolve, reject){
                self.GetFile(url).then(function(data){
                    self.assets[name] = data;
                    resolve();
                });
            })
            return promise;
        }
    }

    Assets.prototype.Load = function(){
        var promises = [];
        for(var i = 0; i < this.urls.length; i++){
            promises.push(this.GetAsset(this.urls[i].url, this.urls[i].name));
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

    return Assets;
});