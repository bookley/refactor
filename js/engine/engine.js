/**
 * Created by Jamie on 03-Apr-15.
 */
define(["require", "exports", "graphics/graphics", "graphics/assets/assetLoader", "camera/camera", "input/input", "game/scene", "game/scenegraph", "camera/behaviours/cameraClickPickerBehaviour"], function (require, exports, Graphics, AssetLoader, Camera, Input, Scene, Scenegraph, CameraClickBehaviour) {
    var assetUrls = [
        {
            url: "assets/shaders/texturedFrag.frag",
            name: "texturedFrag",
            type: "shader"
        },
        {
            url: "assets/shaders/texturedVert.vert",
            name: "texturedVert",
            type: "shader"
        },
        {
            url: "assets/shaders/instancedVert.vert",
            name: "instancedVert",
            type: "shader"
        },
        {
            url: "assets/shaders/debugFrag.frag",
            name: "debugFrag",
            type: "shader"
        },
        {
            url: "assets/shaders/debugVert.vert",
            name: "debugVert",
            type: "shader"
        },
        {
            url: "assets/models/man.obj",
            name: "man",
            type: "mesh"
        },
        {
            url: "assets/textures/mantex.png",
            name: "mantexture",
            type: "texture"
        },
        {
            url: "assets/textures/wood.png",
            name: "exclamation",
            type: "texture"
        }
    ];
    var Engine = (function () {
        function Engine(canvas, sceneClass) {
            var self = this;
            this.ready = false;
            this.canvas = document.getElementById(canvas);
            this.camera = new Camera.Camera();
            this.graphics = new Graphics(this.canvas);
            this.sceneGraph = new Scenegraph();
            this.scene = new sceneClass(this);
            this.input = new Input(this.canvas);
            this.input.ControlCamera(this.camera);
            var pickingBehaviour = new CameraClickBehaviour.CameraClickPickerBehaviour(this.sceneGraph, this.camera);
            pickingBehaviour.setViewportDimensions(this.graphics.viewportWidth, this.graphics.viewportHeight);
            this.input.setOnCameraClickBehaviour(pickingBehaviour);
            this.assetLoader = new AssetLoader(assetUrls);
            this.assetLoader.loadAll().then(function () {
                self.ready = true;
                self.graphics.SetAssets(self.assetLoader);
                self.LoadShaders();
                self.scene.onStart();
            }).catch(function (err) {
                console.error(err.stack);
            });
        }
        Engine.prototype.LoadShaders = function () {
            this.graphics.createShader("TexturedShader", "texturedVert", "texturedFrag", ["aVertexPosition", "aVertexNormal", "aTexCoords"], ["uMVMatrix", "uPMatrix", "uCMatrix", "lightDirection"]);
            this.graphics.createShader("DebugShader", "debugVert", "debugFrag", ["aVertexPosition", "aVertexColour"], ["uMVMatrix", "uPMatrix", "uCMatrix"]);
            this.graphics.createShader("InstancedShader", "instancedVert", "texturedFrag", ["aVertexPosition", "aVertexNormal", "aTexCoords", "aModelCentre"], ["uPMatrix", "uCMatrix", "lightDirection"]);
        };
        return Engine;
    })();
    var engine = new Engine("mycanvas", Scene);
    function loop() {
        if (engine.ready) {
            engine.input.Update();
            engine.sceneGraph.update(0);
            engine.graphics.UseShader("TexturedShader");
            engine.graphics.Draw(engine.camera, engine.sceneGraph);
            engine.graphics.UseShader("InstancedShader");
            engine.graphics.InstancedDraw(engine.camera);
            engine.graphics.UseShader("DebugShader");
            engine.graphics.DebugDraw(engine.camera, engine.sceneGraph);
        }
        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
    return Engine;
});
//# sourceMappingURL=engine.js.map