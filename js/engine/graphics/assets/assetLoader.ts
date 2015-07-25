import Asset = require("graphics/assets/asset");
import RemoteAsset = require("graphics/assets/RemoteAsset");

/**
 * Responsible for resolving a collection of urls into asset objects
 */
class AssetLoader {
    urls:RemoteAsset[];
    assets:Asset[];

    constructor(urls) {
        this.urls = urls;
        this.assets = [];
    }

    /**
     *
     * @param url The url to fire the ajax request to
     * @returns {Promise} Called when the asset file has been downloaded
     * @constructor
     */
    resolveFile(url:string){
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

    resolveAsset(url:string, name:string, type:string){
        var self = this;
        var promise = new Promise(function(resolve, reject){
            self.resolveFile(url).then(function(data){
                self.assets[name] = new Asset(data, name, type);
                console.log("Resolved asset " + name);
                resolve();
            });
        })
        return promise;
    }

    resolveImage(url, name, type){
        var self = this;
        var promise = new Promise(function(resolve, reject){
            var image = new Image();
            image.onload = function(){
                console.log("image loaded");
                self.assets[name] = new Asset(image, name, type);
                resolve();
            };
            image.src = url;
        });
        return promise;
    }

    loadAll(){
        var promises = [];
        for(var i = 0; i < this.urls.length; i++){
            if(this.urls[i].type != "texture")
                promises.push(this.resolveAsset(this.urls[i].url, this.urls[i].name, this.urls[i].type));
            else
                promises.push(this.resolveImage(this.urls[i].url, this.urls[i].name, this.urls[i].type));
        }

        var loadingPromise = Promise.all(promises).then(function(){
            console.log("All _textureAssets loaded");
        }).catch(function(){
            console.log("Failed to load _textureAssets");
        });
        return loadingPromise;
    }

    getAsset(assetName):Asset{
        return this.assets[assetName];
    }

    getByType(type):Asset[]{
        var results = [];
        var keys = Object.keys(this.assets);
        for(var i = 0; i < keys.length; i++){
            if(this.assets[keys[i]].type == type) results.push(this.assets[keys[i]]);
        }

        return results;
    }
}

export = AssetLoader;