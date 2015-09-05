/**
 * Created by Jamie on 03-Apr-15.
 */

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
        name:"exclamation",
        type:"texture"
    },
    {
        url: "assets/textures/tileMap2.png",
        name:"tileMap",
        type:"texture"
    },
    {
        url:"assets/textures/selectTile.png",
        name:"selectTile",
        type:"texture"
    },
    {
        url:"assets/text/test.png",
        name:"test",
        type:"texture"
    },
    {
        url:"assets/text/test.fnt",
        name:"test_fnt",
        type:"fnt"
    },
]

import Graphics = require("core/graphics");
import AssetLoader = require("core/assets/assetLoader");
import Camera = require("camera/camera");
import Input = require("input/input");
import Scene = require("game/scene");
import Scenegraph = require("game/scenegraph");

import CameraClickBehaviour = require("camera/behaviours/cameraClickPickerBehaviour");


class Engine {
    canvas:HTMLCanvasElement;
    camera:Camera.Camera;
    input:Input.InputListener;

    graphics:Graphics;
    assetLoader:AssetLoader;

    sceneGraph:Scenegraph;
    scene:Scene;

    ready:boolean;

    constructor(canvas, sceneClass) {
        var self = this;
        this.ready = false;
        this.canvas = <HTMLCanvasElement>document.getElementById(canvas);

        this.camera = new Camera.Camera();
        this.graphics = new Graphics(this.canvas);

        this.input = new Input.InputListener(this.canvas);
        this.input.ControlCamera(this.camera);

        this.sceneGraph = new Scenegraph();
        this.scene = new sceneClass(this);

        var pickingBehaviour = new CameraClickBehaviour.CameraClickPickerBehaviour(this.sceneGraph, this.camera);
        pickingBehaviour.setViewportDimensions(this.graphics.viewportWidth, this.graphics.viewportHeight);
        this.input.setOnCameraClickBehaviour(pickingBehaviour);

        this.assetLoader = new AssetLoader(assetUrls);
        this.assetLoader.loadAll().then(function () {
            self.ready = true;
            self.graphics.SetAssets(self.assetLoader);
            self.LoadShaders();
            engine.input.setMouseMoveListener(self.scene);
            self.scene.onStart();
        }).catch(function(err){
            console.error(err.stack);
        });
    }

    LoadShaders(){
        this.graphics.createShader("TexturedShader", "texturedVert", "texturedFrag",
            ["aVertexPosition", "aVertexNormal", "aTexCoords"],
            ["uMVMatrix", "uPMatrix", "uCMatrix", "lightDirection"]);


        this.graphics.createShader("DebugShader", "debugVert", "debugFrag",
            ["aVertexPosition", "aVertexColour"],
            ["uMVMatrix", "uPMatrix", "uCMatrix"]);



        this.graphics.createShader("InstancedShader", "instancedVert", "texturedFrag",
            ["aVertexPosition", "aVertexNormal", "aTexCoords"],
            ["uPMatrix", "uCMatrix", "lightDirection"]);

    }
}

var engine = new Engine("mycanvas", Scene);

function loop(){
    if(engine.ready) {
        engine.input.Update();
        engine.sceneGraph.update(0);

        engine.graphics.UseShader("InstancedShader");
        engine.graphics.InstancedDraw(engine.camera);

        engine.graphics.UseShader("TexturedShader");
        engine.graphics.Draw(engine.camera, engine.sceneGraph);

        engine.graphics.UseShader("DebugShader");
        engine.graphics.DebugDraw(engine.camera, engine.sceneGraph);

    }
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);

export = Engine;