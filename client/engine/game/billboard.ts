import GameObject = require("./gameObject");
/**
 * Created by Jamie on 05-Jul-15.
 */


export class Billboard extends GameObject {
    fixed:boolean;

    constructor(){
        super();
    }

    setFixedOrientation(value:boolean){
        this.fixed = value;
    }
}