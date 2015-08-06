/**
 * Created by Jamie on 28-Jun-15.
 */

import GameObject = require("game/gameObject");
import DebugLine = require("graphics/debugLine");
import Scene = require("game/scene");
import TileMap = require("game/tileMap");

class Scenegraph {
    graph:GameObject[];
    debugGraph:DebugLine[];
    transparentGraph:GameObject[];

    tileMap:TileMap.TileMap;
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

export = Scenegraph;