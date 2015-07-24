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
        name:"kirsty",
        type:"texture"
    },
    {
        url: "assets/textures/wood.png",
        name:"exclamation",
        type:"texture"
    }
]

import Graphics = require("graphics/graphics");
import Assets = require("graphics/assets/assetLoader");
import Camera = require("camera/camera");
import Input = require("input/input");
import Scene = require("game/scene");
import Scenegraph = require("game/scenegraph");

import CameraClickBehaviour = require("camera/behaviours/cameraClickPickerBehaviour");


export class Engine {
    canvas:HTMLCanvasElement;
    camera:Camera.Camera;
    input:Input.Input;
    graphics:Graphics.Graphics;
    assetLoader:Assets.AssetLoader;
    ready:boolean;

    constructor(canvas) {
        var self = this;
        this.ready = false;
        this.canvas = <HTMLCanvasElement>document.getElementById(canvas);

        this.camera = new Camera.Camera();
        this.graphics = new Graphics.Graphics(this.canvas);

        this.input = new Input.Input(this.canvas);
        this.input.ControlCamera(this.camera);

        var pickingBehaviour = new CameraClickBehaviour.CameraClickPickerBehaviour(sceneGraph, this.camera);
        pickingBehaviour.setViewportDimensions(this.graphics.viewportWidth, this.graphics.viewportHeight);
        this.input.setOnCameraClickBehaviour(pickingBehaviour);

        this.assetLoader = new Assets.AssetLoader(assetUrls);
        this.assetLoader.loadAll().then(function () {
            self.ready = true;
            self.graphics.SetAssets(self.assetLoader);
            self.LoadShaders();

            scene.onStart();
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
    }
}

var sceneGraph = new Scenegraph.Scenegraph();
var engine = new Engine("mycanvas");
var scene = new Scene.Scene(engine, sceneGraph);

function loop(){
    if(engine.ready) {
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