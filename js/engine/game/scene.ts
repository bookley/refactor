/**
 * Created by Jamie on 14-Jun-15.
 */
import GameObjects = require("game/gameObject");
import Billboard = require("game/billboard");
import DebugLine = require("core/debugLine");
import Peon = require("game/entities/peon");
import Tile = require("game/entities/tile");
import TileMap = require("game/tileMap");
import ImageMap = require("core/imageMap");
import Input = require("input/input");
import SceneGraph = require("game/scenegraph");
import Ray = require("game/ray");

class Scene implements Input.MouseMoveListener {
   engine:any;
   sceneGraph:SceneGraph;

   selectTile:Tile;

   constructor(engine:any){
      this.engine = engine;
       this.engine.graphics._lightDir = [0, 1, 0];
      this.sceneGraph = this.engine.sceneGraph;
      this.sceneGraph.setScene(this);
       this.engine.input.setMouseClickListener(this);
   }

   drawDebugLine(p1:Float32Array, p2:Float32Array){
      this.sceneGraph.debugGraph.push(new DebugLine(this.engine.graphics.ctx, p1, p2));
   }

   onStart(){
       this.selectTile = new Tile(this.engine);
       var tileMap = new TileMap.TileMap(1, 1);
       var imageMap = new ImageMap(this.engine.graphics.assetCollection.getTexture("tileMap"), 1024, 1024, 256, 256);
       tileMap.setImageMap(imageMap);

       var bottomTileLevel = new TileMap.TileLevel(tileMap);
       for(var x = 0; x < 100; x++){
           for(var y = 0; y < 100; y++) {
               var tile = new TileMap.TileMapTile(x - 50, 0, y - 50);

               var rnd = Math.random();
               if(rnd > 0.2){
                   tile.setImageMapIndex(4);
               } else {
                   var randomTextureIndex = Math.round(Math.random() * 16);
                   tile.setImageMapIndex(randomTextureIndex);
               }

               bottomTileLevel.setTile(x * 100 + y, tile);
           }
       }
       tileMap.getTileLevels().push(bottomTileLevel);

       this.engine.graphics.tileMapRenderer.setTileMap(tileMap);
       this.engine.graphics._lightDir = [0, -1, 0];

       this.selectTile.setPosition(0, 0, 0);
       this.selectTile.setScaleSingle(1);
       this.engine.sceneGraph.addEntity(this.selectTile);
   }

    onUpdate(){

    }

    onMouseClick(x, y){
        var peon = new Peon(this.engine);
        peon.setPosition(this.selectTile.x + 0.5, 0, this.selectTile.z + 0.5);
        this.sceneGraph.addEntity(peon);
    }

    onMouseMove(fromX, fromY, toX, toY) {
        var x:number = ((toX * 2) / 800) - 1;
        var y:number =  1 - ((toY * 2) / 600);

        var ray = new Ray(x, y);
        var position = ray.getYPlaneIntersection(this.engine.camera.GetMatrix(), null);

        this.selectTile.setPosition(position[0], 0, position[2]);
    }

    unproject(winx,winy,winz,mat,viewport){
        winz = 2 * winz - 1;
        var invMat = mat4.create();
        mat4.invert(invMat,mat);
        var n = vec4.fromValues(winx, winy, winz, 1);
        vec4.transformMat4(n,n,invMat);
        var n2 = vec3.fromValues(n[0]/n[3], n[1]/n[3], n[2]/n[3]);
        return n2;
    }
};

export = Scene;