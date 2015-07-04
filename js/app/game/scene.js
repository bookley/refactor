define(["require", "exports", "game/gameObject"], function (require, exports, GameObjects) {
    var Scene = (function () {
        function Scene(engine, scenegraph) {
            this.engine = engine;
            this.scenegraph = scenegraph;
        }
        Scene.prototype.onStart = function () {
            var num = 50;
            this.engine.graphics.setBackground(0, 0.2, 0.1);
            this.engine.graphics.SetLightDir(vec3.fromValues(0, 1, 0));
            for (var i = 0; i < 100; i++) {
                var monkey = new GameObjects.GameObject();
                monkey.setMesh(this.engine.graphics.GetMesh("man"));
                monkey.setTexture(this.engine.graphics.GetTexture("mantexture"));
                monkey.setScaleSingle(0.2);
                monkey.setPosition(i, 0, 0);
                var orientation = mat4.create();
                mat4.rotateY(orientation, orientation, 1);
                monkey.setOrientation(orientation);
                this.scenegraph.addEntity(monkey);
            }
        };
        Scene.prototype.onUpdate = function (delta) {
        };
        return Scene;
    })();
    exports.Scene = Scene;
    ;
});
//# sourceMappingURL=scene.js.map