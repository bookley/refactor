import {Asset} from "./asset";
import {RemoteAsset} from "./remoteAsset";
import {Observable, Observer} from "rxjs";

declare var Promise: any;

/**
 * Responsible for resolving a collection of urls into asset objects
 */
export class AssetLoader {
    assets:Asset[];

    constructor(urls:RemoteAsset[]) {
        this.assets = [];
    }

    /**
     * Loads all assets at the specified urls, and returns the assets
     * @param urls
     * @returns {any}
     */
    loadAll(urls:Array<RemoteAsset>): Observable<Asset[]>{
        return Observable.from(urls).do(url => {
           console.log(url);
        })
        .flatMap((remoteAsset: RemoteAsset) => {
            if(remoteAsset.type === "texture")
                return this.resolveImage(remoteAsset.url, remoteAsset.name, remoteAsset.type);
            else
                return this.resolveAsset(remoteAsset.url, remoteAsset.name, remoteAsset.type);
        }).toArray();
    }

    /**
     *
     * @param url The url to fire the ajax request to
     * @returns {Promise} Called when the asset file has been downloaded
     * @constructor
     */
    private resolveFile(url:string): Observable<String> {
        return Observable.create(subscriber => {
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.onreadystatechange = function(){
                if(request.readyState == 0 || request.readyState==4){
                    if(request.status == 200){
                        subscriber.next(request.responseText);
                        subscriber.complete();
                    } else {
                        subscriber.error(new Error(request.status + " " + request.responseText));
                    }
                }
            }
            request.send();
        });
    }

    private resolveAsset(url:string, name:string, type:string): Observable<Asset> {
        return this.resolveFile(url).map((data) => {
            return new Asset(data, name, type);
        });
    }

    private resolveImage(url:string, name:string, type:string): Observable<Asset> {
        return Observable.create(subscriber => {
            let image = new Image();
            image.onload = function(){
                console.log("image loaded");
                subscriber.next(new Asset(image, name, type));
                subscriber.complete();
            };

            image.addEventListener("error", (er:ErrorEvent) => subscriber.error(er));
            image.src = url;
        });
    }

    getAsset(assetName): Asset{
        return this.assets[assetName];
    }

    getByType(type): Asset[]{
        var results = [];
        var keys = Object.keys(this.assets);
        for(var i = 0; i < keys.length; i++){
            if(this.assets[keys[i]].type == type) results.push(this.assets[keys[i]]);
        }

        return results;
    }
}