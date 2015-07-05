/**
 * Created by Jamie on 28-Jun-15.
 */

import GameObject = require("game/gameObject");
import DebugLine = require("graphics/debugLine");
import Scene = require("game/scene");

export class Scenegraph {
    graph:GameObject.GameObject[];
    debugGraph:DebugLine.DebugLine[];
    currentScene:Scene.Scene;

    constructor(){
        this.graph = [];
        this.debugGraph = [];
    }

    addEntity(entity:GameObject.GameObject){
        this.graph.push(entity);
    }

    setScene(scene:Scene.Scene){
        this.currentScene = scene;
    }
};