/**
 * Created by Jamie on 03-Apr-15.
 */
"use strict";
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
    },
    {
        url: "assets/textures/tileMap2.png",
        name: "tileMap",
        type: "texture"
    },
    {
        url: "assets/textures/selectTile.png",
        name: "selectTile",
        type: "texture"
    },
    {
        url: "assets/text/test.png",
        name: "test",
        type: "texture"
    },
    {
        url: "assets/text/test.fnt",
        name: "test_fnt",
        type: "fnt"
    },
];
var graphics_1 = require("./core/graphics");
var assetLoader_1 = require("./core/assets/assetLoader");
var camera_1 = require("./camera/camera");
var input_1 = require("./input/input");
var scene_1 = require("./game/scene");
var scenegraph_1 = require("./game/scenegraph");
var cameraClickPickerBehaviour_1 = require("./camera/behaviours/cameraClickPickerBehaviour");
var Engine = (function () {
    /**
     *
     * @param canvas The name of the canvas element to use for the renderer
     * @param sceneClass
     */
    function Engine(canvas, sceneClass) {
        var self = this;
        this.ready = false;
        //Dep 1
        this.canvas = document.getElementById(canvas);
        //Dep 2
        this.camera = new camera_1.Camera(this.canvas.width, this.canvas.height, 45, 1, 100);
        //Dep 3
        this.graphics = new graphics_1.Graphics(this.canvas);
        //Dep 4
        this.input = new input_1.InputListener(this.canvas);
        this.input.ControlCamera(this.camera);
        //Dep 5
        this.sceneGraph = new scenegraph_1.Scenegraph();
        //Dep 6
        this.scene = new sceneClass(this);
        //Dep 7
        var pickingBehaviour = new cameraClickPickerBehaviour_1.CameraClickPickerBehaviour(this.sceneGraph, this.camera);
        pickingBehaviour.setViewportDimensions(this.graphics.viewportWidth, this.graphics.viewportHeight);
        this.input.setOnCameraClickBehaviour(pickingBehaviour);
        //Dep 8
        this.assetLoader = new assetLoader_1.AssetLoader(assetUrls);
        this.assetLoader.loadAll().then(function () {
            self.ready = true;
            self.graphics.setAssets(self.assetLoader);
            self.loadShaders();
            engine.input.setMouseMoveListener(self.scene);
            self.scene.onStart();
        }).catch(function (err) {
            console.error(err.stack);
        });
    }
    Engine.prototype.loadShaders = function () {
        this.graphics.createShader("TexturedShader", "texturedVert", "texturedFrag", ["aVertexPosition", "aVertexNormal", "aTexCoords"], ["uMVMatrix", "uPMatrix", "uCMatrix", "lightDirection"]);
        this.graphics.createShader("DebugShader", "debugVert", "debugFrag", ["aVertexPosition", "aVertexColour"], ["uMVMatrix", "uPMatrix", "uCMatrix"]);
        this.graphics.createShader("InstancedShader", "instancedVert", "texturedFrag", ["aVertexPosition", "aVertexNormal", "aTexCoords"], ["uPMatrix", "uCMatrix", "lightDirection"]);
    };
    return Engine;
}());
var engine = new Engine("mycanvas", scene_1.Scene);
function loop() {
    if (engine.ready) {
        engine.input.Update();
        engine.sceneGraph.update(0);
        engine.graphics.useShader("InstancedShader");
        engine.graphics.instancedDraw(engine.camera);
        engine.graphics.useShader("TexturedShader");
        engine.graphics.draw(engine.camera, engine.sceneGraph);
        engine.graphics.useShader("DebugShader");
        engine.graphics.debugDraw(engine.camera, engine.sceneGraph);
    }
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);
module.exports = Engine;
//# sourceMappingURL=engine.js.map