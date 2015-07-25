define(["require", "exports", "graphics/debugLine", "game/entities/peon"], function (require, exports, DebugLine, Peon) {
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
            var num = 50;
            this.engine.graphics.setBackground(216 / 255, 227 / 255, 230 / 255);
            this.engine.graphics.SetLightDir(vec3.fromValues(0, 0.7, 0.7));
            var tile = new Peon(this.engine);
            this.sceneGraph.addEntity(tile);
            tile.setScaleSingle(1);
        };
        Scene.prototype.onUpdate = function () {
        };
        return Scene;
    })();
    ;
    return Scene;
});
//# sourceMappingURL=scene.js.map