import GameObject = require("../gameObject");
import Engine = require("../../engine");
/**
 * Created by Jamie on 05-Jul-15.
 */

class Tile extends GameObject{
    engine:Engine;

    constructor(engine){
        super();
        this.engine = engine;

        this.setMesh(engine.graphics.assetCollection.getMesh("square"));
        this.setTexture(engine.graphics.assetCollection.getTexture("selectTile"));
    }
}

export = Tile;