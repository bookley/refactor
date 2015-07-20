define(["require", "exports", "graphics/debugLine", "game/entities/tile"], function (require, exports, DebugLine, Tile) {
    var Scene = (function () {
        function Scene(engine, scenegraph) {
            this.engine = engine;
            this.scenegraph = scenegraph;
            this.scenegraph.setScene(this);
        }
        Scene.prototype.drawDebugLine = function (p1, p2) {
            this.scenegraph.debugGraph.push(new DebugLine.DebugLine(this.engine.graphics.ctx, p1, p2));
        };
        Scene.prototype.onStart = function () {
            var num = 50;
            this.engine.graphics.setBackground(216 / 255, 227 / 255, 230 / 255);
            this.engine.graphics.SetLightDir(vec3.fromValues(0, 0.7, 0.7));
            var tile = new Tile.Tile(this.engine);
            this.scenegraph.addEntity(tile);
            tile.setScaleSingle(1);
            tile.x = 0;
            tile.z = 0;
            tile.y = 0;
        };
        Scene.prototype.onUpdate = function () {
        };
        return Scene;
    })();
    exports.Scene = Scene;
    ;
});
//# sourceMappingURL=scene.js.map