import assetUrls from "./assetsUrls";
import {Container} from "inversify";
import {Graphics} from "./core/graphics";
import {AssetLoader} from "./core/assets/assetLoader";
import {Camera, ArcballCamera} from "./camera/camera";
import {InputListener} from "./input/input";
import {Scene} from "./game/scene";
import {Scenegraph} from "./game/scenegraph";
import {CameraClickPickerBehaviour} from "./camera/behaviours/cameraClickPickerBehaviour";
import {vec3} from "gl-matrix";
import {ArcballCameraHandler} from "./input/inputHandlers/arcballCameraHandler";


class Engine {
    canvas:HTMLCanvasElement;
    camera:ArcballCamera;
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


        this.camera = new ArcballCamera(vec3.fromValues(0, 0, 0), 10, 0, 1);
        this.camera.setPerspective(45, this.canvas.width, this.canvas.height, 0.1, 100);
        this.graphics = new Graphics(this.canvas);
        this.input = new InputListener(this.canvas);
        this.input.addMouseHandler(new ArcballCameraHandler(this.camera));

        this.sceneGraph = new Scenegraph();
        this.scene = new sceneClass(this);

        var pickingBehaviour = new CameraClickPickerBehaviour(this.sceneGraph, this.camera);
        pickingBehaviour.setViewportDimensions(this.graphics.viewportWidth, this.graphics.viewportHeight);

        this.input.setOnCameraClickBehaviour(pickingBehaviour);
        this.assetLoader = new AssetLoader(assetUrls);
        this.assetLoader.loadAll(assetUrls)
            .subscribe((assets) => {
                this.ready = true;
                this.graphics.assetCollection.setAssets(assets);
                this.loadShaders();
                //this.input.setMouseMoveListener(self.scene);
                this.scene.onStart();
            });
    }

    loadShaders(){
        this.graphics.assetCollection.createShader({
           name: "TexturedShader",
            vertexShaderFile: "texturedVert",
            fragmentShaderFile: "texturedFrag",
            uniformNames: ["uMVMatrix", "uPMatrix", "uCMatrix", "lightDirection", "shadowSampler"],
            attributeNames: ["aVertexPosition", "aVertexNormal", "aTexCoords"]
        });

        this.graphics.assetCollection.createShader({
            name: "DebugShader",
            vertexShaderFile: "debugVert",
            fragmentShaderFile: "debugFrag",
            uniformNames: ["uMVMatrix", "uPMatrix", "uCMatrix"],
            attributeNames: ["aVertexPosition", "aVertexColour"]
        });
    }
}

var engine = new Engine("mycanvas", Scene);

function loop(){
    if(engine.ready) {
        engine.input.update();
        engine.sceneGraph.update(0);

        engine.graphics.useShader("TexturedShader");
        engine.graphics.instancedDraw(engine.camera, engine.sceneGraph);

        engine.graphics.useShader("TexturedShader");
        engine.graphics.draw(engine.camera, engine.sceneGraph);

        engine.graphics.useShader("DebugShader");
        engine.graphics.debugDraw(engine.camera, engine.sceneGraph);

    }
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);

export = Engine;
