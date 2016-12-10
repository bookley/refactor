/**
 * Created by Jamie on 25-Jul-15.
 */

import {ImageMap} from "../core/imageMap";

/**
 * Create an array of tiles with an imagemap put in
 * where each tile has a position, orientation and imageMap index
 */

interface InvalidationListener {
    invalidate():void;
}

export class TileMap implements InvalidationListener {

    private tileLevels:TileLevel[];
    private tileWidth:number;
    private tileHeight:number;

    private isInvalidated:boolean;
    private imageMap:ImageMap;


    constructor(tileWidth, tileHeight){
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.tileLevels = [];
        this.isInvalidated = true;
    }

    setImageMap(imageMap:ImageMap){
        this.imageMap = imageMap;
    }

    getImageMap():ImageMap{
        return this.imageMap;
    }

    getTileLevels():TileLevel[]{
        return this.tileLevels;
    }

    getTileWidth():number {
        return this.tileWidth;
    }

    getTileHeight():number {
        return this.tileHeight;
    }

    reset():void {
        this.isInvalidated = false;
    }

    invalidate():void {
        this.isInvalidated = true;
    }
}

export class TileLevel {
    private tiles:TileMapTile[];
    private invalidationListener:InvalidationListener;

    constructor(invalidationListener:InvalidationListener){
        this.tiles = [];
        this.invalidationListener = invalidationListener;
    }

    getTiles():TileMapTile[]{
        return this.tiles;
    }

    setTiles(tileMapTiles:TileMapTile[]){
        this.tiles = tileMapTiles;
        this.invalidationListener.invalidate();
    }

    setTile(index, tile){
        this.tiles[index] = tile;
        this.invalidationListener.invalidate();
    }
}

export class TileMapTile {
    x: number;
    y: number;
    z: number;

    imageMapIndex:number;

    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;

        this.imageMapIndex = 0;
    }

    setImageMapIndex(index:number){
        this.imageMapIndex = index;
    }

    getImageMapIndex():number{
        return this.imageMapIndex;
    }

}