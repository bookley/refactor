/**
 * Created by Jamie on 14-Jun-15.
 */
import GameObjects = require("game/gameObject");
import Billboard = require("game/billboard");
import DebugLine = require("graphics/debugLine");

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
      this.engine.graphics.setBackground(0, 0.2, 0.1);
      this.engine.graphics.SetLightDir(vec3.fromValues(0, 1, 0));

      var monkey = new GameObjects.GameObject();
      monkey.setMesh(this.engine.graphics.GetMesh("man"));
      monkey.setTexture(this.engine.graphics.GetTexture("mantexture"));
      monkey.setPosition(0, 0, 0);
      monkey.setScaleSingle(0.5);
      var orientation = mat4.create();
      monkey.setOrientation(orientation);
      this.scenegraph.addEntity(monkey);

      var billboard = new Billboard.Billboard();
      billboard.setMesh(this.engine.graphics.GetMesh("square"));
      billboard.setTexture(this.engine.graphics.GetTexture("exclamation"));
      billboard.setPosition(2, 0, 0);
      this.scenegraph.addEntity(billboard);
   }

   onUpdate(delta){

   }
};