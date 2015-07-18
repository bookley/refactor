/**
 * Created by Jamie on 14-Jun-15.
 */
import GameObjects = require("game/gameObject");
import Billboard = require("game/billboard");
import DebugLine = require("graphics/debugLine");
import Peon = require("game/entities/peon");
import Tile = require("game/entities/tile");

export class Scene {
   engine:any;
   scenegraph:any;

   constructor(engine, scenegraph){
      this.engine = engine;
      this.scenegraph = scenegraph;
      this.scenegraph.setScene(this);
   }

   drawDebugLine(p1:Float32Array, p2:Float32Array){
      this.scenegraph.debugGraph.push(new DebugLine.DebugLine(this.engine.graphics.ctx, p1, p2));
   }

   onStart(){
      var num = 50;
      this.engine.graphics.setBackground(216/255, 227/255, 230/255);
      this.engine.graphics.SetLightDir(vec3.fromValues(-1, 0, 0));

      for(var i = 0; i < 100; i++) {
         var monkey = new Peon.Peon(this.engine);
         this.scenegraph.addEntity(monkey);
      }

      for(var x = -10; x < 10; x++){
         for(var z = -10; z < 10; z++) {
            var tile = new Tile.Tile(this.engine);
            this.scenegraph.addEntity(tile);
            tile.setScaleSingle(10);
            tile.x = x * 20;
            tile.z = z * 20;
         }
      }
   }
};