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
        url: "assets/textures/kirsty.png",
        name:"kirsty",
        type:"texture"
    }
]

import Graphics = require("graphics/graphics");
import Assets = require("graphics/assets");
import Camera = require("camera/camera");
import Input = require("Input");
import Scene = require("game/scene");
import Scenegraph = require("game/scenegraph");


class Engine {
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
        this.input = new Input.Input(this.canvas);
        this.input.ControlCamera(this.camera)

        this.graphics = new Graphics.Graphics(this.canvas);
        this.assetLoader = new Assets.AssetLoader(assetUrls);
        this.assetLoader.loadAll().then(function () {
            self.ready = true;
            self.graphics.SetAssets(self.assetLoader);
            self.LoadShaders();
            self.graphics.UseShader("TexturedShader");
            self.graphics.SetLightDir([0, -1, 1]);
            scene.onStart();
        }).catch(function(err){
            console.error(err.stack);
        });
    }

    LoadShaders(){
        this.graphics.LoadShader("TexturedShader", "texturedVert", "texturedFrag",
            ["aVertexPosition", "aVertexColour", "aVertexNormal", "aTexCoords"],
            ["uMVMatrix", "uPMatrix", "uCMatrix", "lightDirection"]);
    }
}

var engine = new Engine("mycanvas");
var sceneGraph = new Scenegraph.Scenegraph();
var scene = new Scene.Scene(engine, sceneGraph);

function loop(){
    if(engine.ready) {
        engine.input.Update();
        scene.onUpdate(0);
        engine.graphics.Draw(engine.camera, sceneGraph);
    }
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);