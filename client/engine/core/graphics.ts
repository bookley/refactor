import {mat4, vec3} from 'gl-matrix';

import Shader = require("./shaders");
import {AssetCollection} from "./assets/assetCollection";
import TileMapRenderer = require("./tileMapRenderer");
import {Context, DefaultContext} from "./context";
import ShadowManager from "./graphics/shadowManager";
import {Camera} from "../camera/camera";

/**
 * Responsible for initializing and maintaining the main WebGL context
 */
export class Graphics {
    static DRAW_DEBUG_INFO:boolean = false;
    static DEFAULT_LIGHT_DIRECTION:vec3 = vec3.fromValues(0, -1, 0);
    static DEFAULT_CLEAR_COLOR = {
        r:1,
        g:1,
        b:1,
        a:1
    };

    ctx:WebGLRenderingContext;
    viewportWidth:number;
    viewportHeight:number;

    _lightDir:vec3;
    currentShader:Shader;

    assetCollection:AssetCollection;
    tileMapRenderer:TileMapRenderer;
    shadowManager: ShadowManager;

    context:Context;


    constructor(canvas:HTMLCanvasElement) {
        this.initGL(canvas)
        this.assetCollection = new AssetCollection(this.ctx);
        this.tileMapRenderer = new TileMapRenderer(this.ctx);
        this.shadowManager = new ShadowManager(this.ctx, 512, 0.01);
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

    useShader(shaderName) {
        this.currentShader = this.assetCollection.getShader(shaderName);
        this.currentShader.activate();
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
    draw(camera: Camera, scenegraph) {
        this.context.setVertexAttribArrayEnabled(3, false);
        if (!camera) throw new Error("Can't draw if a camera isn't set");
        this.ctx.enable(this.ctx.DEPTH_TEST);
        for (var i = 0; i < scenegraph.graph.length; i++) {
            var entity = scenegraph.graph[i];
            if(!entity.visible) continue;

            var modelMatrix = entity.getMatrix();
            if (entity.texture != null) {
                entity.texture.bind();
            }
            entity.mesh.draw(this.currentShader, camera.projectionMatrix, camera.viewMatrix, modelMatrix, this._lightDir);
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
            line.draw(this.currentShader, mat4.create());
        }


        for(var i = 0; i < scenegraph.graph.length; i++){
            var entity = scenegraph.graph[i];
            var modelMatrix = entity.getMatrix();
            entity.mesh.drawNormals(this.currentShader, modelMatrix);
        }
    }

    instancedDraw(camera: Camera, scenegraph){
        //this.shadowManager.bind();
        //this.shadowManager.draw(camera, scenegraph, this.currentShader, this._lightDir);
        //this.shadowManager.unbind();

        this.ctx.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        this.ctx.clear(this.ctx.DEPTH_BUFFER_BIT | this.ctx.COLOR_BUFFER_BIT);

        /* Mesh position */
        if (!camera) throw new Error("Can't draw if a camera isn't set");

        var identity: mat4 = mat4.create();
        identity = mat4.identity(identity);

        //this.ctx.activeTexture(this.ctx.TEXTURE1);
        //this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.shadowManager.texture);
        //this.currentShader.pass1I("shadowSampler", 1);

        this.tileMapRenderer.draw(this.currentShader, camera.projectionMatrix, camera.viewMatrix, identity, this._lightDir);
        this.ctx.activeTexture(this.ctx.TEXTURE1);
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);
    }
}