import GameObject = require("./gameObject");
import DebugLine = require("../core/debugLine");
import {TileMap} from "./tileMap";
import {Scene} from "./scene";
/**
 * Created by Jamie on 28-Jun-15.
 */



export class Scenegraph {
    graph:GameObject[];
    debugGraph:DebugLine[];
    transparentGraph:GameObject[];

    tileMap:TileMap;
    currentScene:Scene;

    constructor(){
        this.graph = [];
        this.debugGraph = [];
        this.transparentGraph = [];
    }

    addEntity(entity:GameObject){
        this.graph.push(entity);
    }

    addTransparentEntity(entity:GameObject){
        this.transparentGraph.push(entity);
    }

    setScene(scene:Scene){
        this.currentScene = scene;
    }

    update(delta){
        for(var i = 0; i < this.graph.length; i++){
            this.graph[i].update(0);
        }
    }
};