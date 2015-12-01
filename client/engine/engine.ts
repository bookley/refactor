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

    /**
     *
     * @param canvas The name of the canvas element to use for the renderer
     * @param sceneClass
     */
    constructor(canvas:string, sceneClass) {
        var self = this;
        this.ready = false;

        //Dep 1
        this.canvas = <HTMLCanvasElement>document.getElementById(canvas);

        //Dep 2
        this.camera = new Camera.Camera(this.canvas.width, this.canvas.height, 45, 1, 100);

        //Dep 3
        this.graphics = new Graphics(this.canvas);

        //Dep 4
        this.input = new Input.InputListener(this.canvas);
        this.input.ControlCamera(this.camera);

        //Dep 5
        this.sceneGraph = new Scenegraph();

        //Dep 6
        this.scene = new sceneClass(this);

        //Dep 7
        var pickingBehaviour = new CameraClickBehaviour.CameraClickPickerBehaviour(this.sceneGraph, this.camera);
        pickingBehaviour.setViewportDimensions(this.graphics.viewportWidth, this.graphics.viewportHeight);
        this.input.setOnCameraClickBehaviour(pickingBehaviour);

        //Dep 8
        this.assetLoader = new AssetLoader(assetUrls);
        this.assetLoader.loadAll().then(function () {
            self.ready = true;
            self.graphics.setAssets(self.assetLoader);
            self.loadShaders();
            engine.input.setMouseMoveListener(self.scene);
            self.scene.onStart();
        }).catch(function(err){
            console.error(err.stack);
        });
    }

    loadShaders(){
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

export = Engine;