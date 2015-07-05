/**
 * Created by Jamie on 05-Jul-15.
 */

import GameObject = require("game/gameObject");
export class Billboard extends GameObject.GameObject {
    fixed:boolean;

    constructor(){
        super();
    }

    setFixedOrientation(value:boolean){
        this.fixed = value;
    }
}