import assetUrls from "./assetsUrls";
import {Container} from "inversify";
import {Graphics} from "./core/graphics";
import {AssetLoader} from "./core/assets/assetLoader";
import {Camera} from "./camera/camera";
import {InputListener} from "./input/input";
import {Scene} from "./game/scene";
import {Scenegraph} from "./game/scenegraph";
import {CameraClickPickerBehaviour} from "./camera/behaviours/cameraClickPickerBehaviour";


class Engine {
    canvas:HTMLCanvasElement;
    camera:Camera;
    input:InputListener;
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
        this.canvas = <HTMLCanvasElement>document.getElementById(canvas);
        let container = new Container();


        this.camera = new Camera(this.canvas.width, this.canvas.height, 45, 1, 100);
        this.graphics = new Graphics(this.canvas);
        this.input = new InputListener(this.canvas);
        this.input.ControlCamera(this.camera);
        this.sceneGraph = new Scenegraph();
        this.scene = new sceneClass(this);

        var pickingBehaviour = new CameraClickPickerBehaviour(this.sceneGraph, this.camera);
        pickingBehaviour.setViewportDimensions(this.graphics.viewportWidth, this.graphics.viewportHeight);

        this.input.setOnCameraClickBehaviour(pickingBehaviour);
        this.assetLoader = new AssetLoader(assetUrls);
        this.assetLoader.loadAll(assetUrls)
            .subscribe((assets) => {
                this.ready = true;
                console.log(assets);
                this.graphics.setAssets(assets);
                this.loadShaders();
                this.input.setMouseMoveListener(self.scene);
                this.scene.onStart();
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
            ["uMVMatrix", "uPMatrix", "uCMatrix", "lightDirection"]);

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
