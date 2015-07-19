/**
 * Created by Jamie on 05-Jul-15.
 */

import GameObject = require("game/gameObject");
import Engine = require("engine");

engine:Engine.Engine;

export class Tile extends GameObject.GameObject{
    engine:Engine.Engine;

    constructor(engine){
        super();
        this.engine = engine;
        this.setMesh(engine.graphics.GetMesh("square"));
        this.setTexture(engine.graphics.GetTexture("exclamation"));
        var orientation = mat4.create();
        //mat4.rotateX(orientation, orientation, Math.PI / 2);
        //this.setOrientation(orientation);
        //this.y = -10;
    }
}