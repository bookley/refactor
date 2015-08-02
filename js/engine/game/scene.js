define(["require", "exports", "graphics/debugLine", "game/entities/tile", "game/tileMap", "graphics/imageMap"], function (require, exports, DebugLine, Tile, TileMap, ImageMap) {
    var Scene = (function () {
        function Scene(engine) {
            this.engine = engine;
            this.sceneGraph = this.engine.sceneGraph;
            this.sceneGraph.setScene(this);
        }
        Scene.prototype.drawDebugLine = function (p1, p2) {
            this.sceneGraph.debugGraph.push(new DebugLine(this.engine.graphics.ctx, p1, p2));
        };
        Scene.prototype.onStart = function () {
            this.selectTile = new Tile(this.engine);
            var tileMap = new TileMap.TileMap(1, 1);
            var imageMap = new ImageMap(this.engine.graphics.assetCollection.getTexture("tileMap"), 1024, 1024, 256, 256);
            tileMap.setImageMap(imageMap);
            var bottomTileLevel = new TileMap.TileLevel(tileMap);
            for (var x = 0; x < 100; x++) {
                for (var y = 0; y < 100; y++) {
                    var tile = new TileMap.TileMapTile(x - 50, 0, y - 50);
                    var rnd = Math.random();
                    if (rnd > 0.2) {
                        tile.setImageMapIndex(4);
                    }
                    else {
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
        };
        Scene.prototype.onUpdate = function () {
        };
        Scene.prototype.onMouseMove = function (fromX, fromY, toX, toY) {
            var x = ((toX * 2) / 800) - 1;
            var y = 1 - ((toY * 2) / 600);
            var perspective = mat4.create();
            mat4.perspective(perspective, 45, 800 / 600, 0.1, 100.0);
            mat4.mul(perspective, perspective, this.engine.camera.GetMatrix());
            var mouseClipNear = this.unproject(x, y, -1, perspective, [0, 0, 600, 600]);
            var mouseClipFar = this.unproject(x, y, 0, perspective, [0, 0, 600, 600]);
            var dir = vec3.create();
            vec3.sub(dir, mouseClipFar, mouseClipNear);
            vec3.normalize(dir, dir);
            var inverseCamera = mat4.create();
            mat4.invert(inverseCamera, this.engine.camera.GetMatrix());
            var cameraPosition = vec3.fromValues(inverseCamera[12], inverseCamera[13], inverseCamera[14]);
            var distance = -cameraPosition[1] / dir[1];
            vec3.scale(dir, dir, distance);
            var roundexX = Math.floor(cameraPosition[0] + dir[0]);
            var roundedZ = Math.floor(cameraPosition[2] + dir[2]);
            this.selectTile.setPosition(roundexX, 0, roundedZ);
        };
        Scene.prototype.unproject = function (winx, winy, winz, mat, viewport) {
            winz = 2 * winz - 1;
            var invMat = mat4.create();
            mat4.invert(invMat, mat);
            var n = vec4.fromValues(winx, winy, winz, 1);
            vec4.transformMat4(n, n, invMat);
            var n2 = vec3.fromValues(n[0] / n[3], n[1] / n[3], n[2] / n[3]);
            return n2;
        };
        return Scene;
    })();
    ;
    return Scene;
});
//# sourceMappingURL=scene.js.map