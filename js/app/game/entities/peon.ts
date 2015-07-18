/**
 * Created by Jamie on 05-Jul-15.
 */

import GameObject = require("game/gameObject");
import Engine = require("engine");

export class Peon extends GameObject.GameObject{

    engine:Engine.Engine;

    maxX = -100;
    maxZ = -100;

    direction:Float32Array;
    timer = 0;
    nextChange = 0;

    constructor(engine){
        super();
        this.engine = engine;
        this.setMesh(engine.graphics.GetMesh("man"));
        this.setTexture(engine.graphics.GetTexture("mantexture"));
        this.setScaleSingle(0.5);
        this.pickRandomPosition();
        this.randomOrientation();
    }

    pickRandomPosition(){
        var randomX = Math.random() * this.maxX + 50;
        var randomZ = Math.random() * this.maxZ + 50;
        this.setPosition(randomX, -10, randomZ);
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

        this.x += this.direction[0] * 0.1;
        this.z += this.direction[1] * 0.1;

        if(this.x > 50 || this.x < -50){
            this.direction[0] *= -1;
        }
        if(this.z > 50 || this.z < -50){
            this.direction[1] *= -1;
        }
    }
}