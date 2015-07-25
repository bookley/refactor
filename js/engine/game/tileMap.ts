/**
 * Created by Jamie on 25-Jul-15.
 */

/**
 * Create an array of tiles with an imagemap put in
 * where each tile has a position, orientation and imageMap index
 */
class TileMap {
    tileRows:TileLevel[];
    ctx:WebGLRenderingContext;

    constructor(ctx:WebGLRenderingContext){

        this.tileRows = [];
        var bottomTileLevel = new TileLevel();
        for(var x = 0; x < 10; x++){
            for(var y = 0; y < 10; y++) {
                var tile = new TileMapTile(x, y, 0);
                bottomTileLevel.tiles[x * 10 + y] = tile;
            }
        }
    }
}

class TileLevel {
    tiles:TileMapTile[];

    constructor(){
        this.tiles = [];
    }
}

class TileMapTile {
    x: number;
    y: number;
    z: number;

    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

export = TileMap;