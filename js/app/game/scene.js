/**
 * Created by Jamie on 14-Jun-15.
 */
define(["game/Entity"], function(Entity){
   function Scene(engine, scenegraph){
      this.engine = engine;
      this.scenegraph = scenegraph;
   }

   var monkeys = [];
   var posX = 0;

   Scene.prototype.onStart = function(){
      var num = 50;
      this.engine.graphics.setBackground(0, 0.2, 0.2);
      this.engine.graphics.SetLightDir(vec3.fromValues(0, 1, 0));
      for(var i = -100; i < 100; i++) {
         var monkey = new Entity();
         monkey.setMesh(this.engine.graphics.GetMesh("monkey"));
         monkey.setScaleSingle(0.2);
         monkey.setPosition(i * 1.5, 0, -2);
         monkey.posX = i;
         this.scenegraph.addEntity(monkey);
         monkeys.push(monkey);
      }
   }

   Scene.prototype.onUpdate = function(delta){
      for(var i = 0; i < monkeys.length; i++) {
         var monkey = monkeys[i];
         monkey.posX += 0.05;
         var posY = Math.sin(monkey.posX);
         monkey.y = posY;
      }
   }

   return Scene;
});