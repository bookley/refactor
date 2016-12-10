import * as GLM from "gl-matrix";

import Shader = require("./shaders");
import AssetCollection = require("./assets/assetCollection");
import TileMapRenderer = require("./tileMapRenderer");
import {Context, DefaultContext} from "./context";
import {AssetLoader} from "./assets/assetLoader";
/**
 * Responsible for initializing and maintaining the main WebGL context
 */
export class Graphics {
    static DRAW_DEBUG_INFO:boolean = false;
    static DEFAULT_LIGHT_DIRECTION:number[] = [0, -1, 0];
    static DEFAULT_CLEAR_COLOR = {
        r:1,
        g:1,
        b:1,
        a:1
    };

    ctx:WebGLRenderingContext;
    viewportWidth:number;
    viewportHeight:number;

    _lightDir:number[];
    currentShader:Shader;
    pMatrix:Float32Array;

    assetCollection:AssetCollection;
    tileMapRenderer:TileMapRenderer;

    context:Context;


    constructor(canvas:HTMLCanvasElement) {
        this.initGL(canvas)
        this.assetCollection = new AssetCollection(this.ctx);
        this.tileMapRenderer = new TileMapRenderer(this.ctx);
    }

    private initGL(canvas:HTMLCanvasElement):void{
        this.context = new DefaultContext(canvas);
        this.ctx = canvas.getContext("webgl");

        this.viewportWidth = canvas.width;
        this.viewportHeight = canvas.height;

        if (!this.ctx) alert("Error initializing WebGL context");
        this._lightDir = Graphics.DEFAULT_LIGHT_DIRECTION;
        this.context.clearColor(Graphics.DEFAULT_CLEAR_COLOR.r, Graphics.DEFAULT_CLEAR_COLOR.g, Graphics.DEFAULT_CLEAR_COLOR.b, Graphics.DEFAULT_CLEAR_COLOR.a);
        this.context.setDepthTestEnabled(true)
    }

    setBackground(r, g, b) {
        this.context.clearColor(r, g, b, 1.0);
    }

    setAssets(assetLoader:AssetLoader) {
        this.assetCollection.setAssets(assetLoader);
    }

    createShader(shaderName:string, vShaderName:string, fShaderName:string, attributes:string[], uniforms:string[]) {
        this.assetCollection.createShader(shaderName, vShaderName, fShaderName, attributes, uniforms);
    }

    useShader(shaderName) {
        this.currentShader = this.assetCollection.getShader(shaderName);
        this.currentShader.Activate();
    }

    setLightDir(vec) {
        this._lightDir = vec;
    }

    /**
     * Draws the entities in the scenegraph
     * @param camera The camera to use when rendering the scene
     * @param scenegraph The scenegraph to interate over
     * @constructor
     */
    draw(camera, scenegraph) {
        this.context.setVertexAttribArrayEnabled(3, false);
        /* Mesh position */
        this.currentShader.passMatrix("uPMatrix", camera.getPerspectiveMatrix());
        this.currentShader.passVec3("lightDirection", this._lightDir);

        if (!camera) throw new Error("Can't draw if a camera isn't set");
        this.currentShader.passMatrix("uCMatrix", camera.getMatrix());
        this.ctx.enable(this.ctx.DEPTH_TEST);
        for (var i = 0; i < scenegraph.graph.length; i++) {
            var entity = scenegraph.graph[i];
            if(!entity.visible) continue;

            var modelMatrix = entity.getMatrix();
            if (entity.texture != null) {
                entity.texture.Bind();
            }
            entity.mesh.Draw(this.currentShader, modelMatrix);
        }
    }

    /**
     * Renders the debug information in the given scenegraph, and the normals of the entities in the scenegraph
     * @param camera The camera to use when rendering the scene
     * @param scenegraph The scenegraph to interate over
     */
    debugDraw(camera, scenegraph){
        if(!Graphics.DRAW_DEBUG_INFO) return;

        if (!camera) throw new Error("Can't draw if a camera isn't set");

        this.currentShader.passMatrix("uPMatrix", camera.getPerspectiveMatrix());
        this.currentShader.passMatrix("uCMatrix", camera.GetMatrix());
        for(var i = 0; i < scenegraph.debugGraph.length; i++){
            var line = scenegraph.debugGraph[i];
            line.draw(this.currentShader, GLM.mat4.create());
        }


        for(var i = 0; i < scenegraph.graph.length; i++){
            var entity = scenegraph.graph[i];
            var modelMatrix = entity.getMatrix();
            entity.mesh.DrawNormals(this.currentShader, modelMatrix);
        }
    }

    instancedDraw(camera){
        this.ctx.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        this.ctx.clear(this.ctx.DEPTH_BUFFER_BIT | this.ctx.COLOR_BUFFER_BIT);

        /* Mesh position */
        this.currentShader.passMatrix("uPMatrix", camera.getPerspectiveMatrix());
        this.currentShader.passVec3("lightDirection", this._lightDir);

        if (!camera) throw new Error("Can't draw if a camera isn't set");
        this.currentShader.passMatrix("uCMatrix", camera.getMatrix());

        this.tileMapRenderer.draw(this.currentShader);
    }
}