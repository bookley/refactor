/**
 * Created by Jamie on 03-Apr-15.
 */
define(["require", "exports", "graphics/graphics", "graphics/assets", "camera/camera", "input/input", "game/scene", "game/scenegraph", "camera/behaviours/cameraClickPickerBehaviour"], function (require, exports, Graphics, Assets, Camera, Input, Scene, Scenegraph, CameraClickBehaviour) {
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
            url: "assets/textures/mantex2.png",
            name: "mantexture",
            type: "texture"
        },
        {
            url: "assets/textures/kirsty.png",
            name: "kirsty",
            type: "texture"
        },
        {
            url: "assets/textures/wood.png",
            name: "exclamation",
            type: "texture"
        }
    ];
    var Engine = (function () {
        function Engine(canvas) {
            var self = this;
            this.ready = false;
            this.canvas = document.getElementById(canvas);
            this.camera = new Camera.Camera();
            this.graphics = new Graphics.Graphics(this.canvas);
            this.input = new Input.Input(this.canvas);
            this.input.ControlCamera(this.camera);
            var pickingBehaviour = new CameraClickBehaviour.CameraClickPickerBehaviour();
            pickingBehaviour.setViewportDimensions(this.graphics.viewportWidth, this.graphics.viewportHeight);
            pickingBehaviour.setScenegraph(sceneGraph);
            pickingBehaviour.setCamera(this.camera);
            this.input.setOnCameraClickBehaviour(pickingBehaviour);
            this.assetLoader = new Assets.AssetLoader(assetUrls);
            this.assetLoader.loadAll().then(function () {
                self.ready = true;
                self.graphics.SetAssets(self.assetLoader);
                self.LoadShaders();
                self.graphics.SetLightDir([0, -1, 1]);
                scene.onStart();
            }).catch(function (err) {
                console.error(err.stack);
            });
        }
        Engine.prototype.LoadShaders = function () {
            this.graphics.LoadShader("TexturedShader", "texturedVert", "texturedFrag", ["aVertexPosition", "aVertexColour", "aVertexNormal", "aTexCoords"], ["uMVMatrix", "uPMatrix", "uCMatrix", "lightDirection"]);
            this.graphics.LoadShader("DebugShader", "debugVert", "debugFrag", ["aVertexPosition", "aVertexColour"], ["uMVMatrix", "uPMatrix", "uCMatrix"]);
        };
        return Engine;
    })();
    exports.Engine = Engine;
    var sceneGraph = new Scenegraph.Scenegraph();
    var engine = new Engine("mycanvas");
    var scene = new Scene.Scene(engine, sceneGraph);
    function loop() {
        if (engine.ready) {
            engine.input.Update();
            sceneGraph.update(0);
            engine.graphics.UseShader("TexturedShader");
            engine.graphics.Draw(engine.camera, sceneGraph);
            engine.graphics.UseShader("DebugShader");
            engine.graphics.DebugDraw(engine.camera, sceneGraph);
        }
        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
});
//# sourceMappingURL=engine.js.map