/**
 * Created by Jamie on 25-Jul-15.
 */

import Texture = require("core/texture");
class ImageMap {
    private width:number;
    private height:number;
    private tileHeight:number;
    private tileWidth:number;
    private texture:Texture;

    constructor(texture:Texture, width:number, height:number, tileWidth:number, tileHeight:number){
        this.width = width;
        this.height = height;
        this.texture = texture;

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }

    getTexture():Texture{
        return this.texture;
    }

    /**
     *
     * @param index
     * @returns {Array} The array of the texture positions of the four corners of the tile
     */
    getCoordsAtIndex(index:number):number[]{
        var finalWidth = index * this.tileWidth;
        var x:number, y:number;

        if(finalWidth >= this.width) {
            var rowNum = Math.floor(finalWidth / this.width);
            var offset = finalWidth % this.width;
            x = offset;
            y = rowNum * this.tileHeight;
        } else {
            x = finalWidth;
            y = 0;
        }


        var result = [];

        //bottom left
        result.push(x / this.width);
        result.push((y + this.tileHeight) / this.height);

        //bottom right
        result.push((x + this.tileWidth) / this.width);
        result.push((y + this.tileHeight) / this.height);

        //top right
        result.push((x + this.tileWidth) / this.width);
        result.push(y / this.height);

        //top left
        result.push(x / this.width);
        result.push(y / this.height);

        return result;
    }

    doSomething(){
        return "hi";
    }
}

export = ImageMap;