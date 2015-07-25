/**
 * Created by Jamie on 05-Jul-15.
 */

import GameObject = require("game/gameObject");
import Engine = require("engine");

engine:Engine;

class Tile extends GameObject{
    engine:Engine;

    constructor(engine){
        super();
        this.engine = engine;
        this.setMesh(engine.graphics.assetCollection.getMesh("square"));
        this.setTexture(engine.graphics.assetCollection.getTexture("exclamation"));
        var orientation = mat4.create();
    }
}

export = Tile;