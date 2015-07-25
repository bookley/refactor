/**
 * Created by Jamie on 14-Jun-15.
 */
import GameObjects = require("game/gameObject");
import Billboard = require("game/billboard");
import DebugLine = require("graphics/debugLine");
import Peon = require("game/entities/peon");
import Tile = require("game/entities/tile");

class Scene {
   engine:any;
   sceneGraph:any;

   constructor(engine:any){
      this.engine = engine;
      this.sceneGraph = this.engine.sceneGraph;
      this.sceneGraph.setScene(this);
   }

   drawDebugLine(p1:Float32Array, p2:Float32Array){
      this.sceneGraph.debugGraph.push(new DebugLine(this.engine.graphics.ctx, p1, p2));
   }

   onStart(){
      var num = 50;
      this.engine.graphics.setBackground(216/255, 227/255, 230/255);
      this.engine.graphics.SetLightDir(vec3.fromValues(0, 0.7, 0.7));

        var tile = new Peon(this.engine);
        this.sceneGraph.addEntity(tile);
        tile.setScaleSingle(1);
   }

    onUpdate(){

    }
};

export = Scene;