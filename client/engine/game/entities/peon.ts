import GameObject = require("../gameObject");
import Engine = require("../../engine");
import {vec2} from 'gl-matrix';

/**
 * Created by Jamie on 05-Jul-15.
 */


class Peon extends GameObject {

    engine:Engine;

    maxX = -100;
    maxZ = -100;

    direction:vec2;
    timer = 0;
    nextChange = 0;

    constructor(engine){
        super();
        this.engine = engine;
        this.setMesh(engine.graphics.assetCollection.getMesh("man"));
        this.setTexture(engine.graphics.assetCollection.getTexture("mantexture"));
        this.setScaleSingle(0.2);
        this.randomOrientation();
    }

    randomOrientation(){
        this.direction = vec2.fromValues(Math.random() * 2 -1, Math.random() * 2 -1);
        vec2.normalize(this.direction, this.direction);
        this.nextChange = Math.random() * 150 + 10;
    }

    update(){
        this.timer++;
        if(this.timer > this.nextChange){
            this.randomOrientation();
            this.timer = 0;
        }

        this.x += this.direction[0] * 0.01;
        this.z += this.direction[1] * 0.01;

        if(this.x > 50 || this.x < -50){
            this.direction[0] *= -1;
        }
        if(this.z > 50 || this.z < -50){
            this.direction[1] *= -1;
        }
    }
}

export = Peon;