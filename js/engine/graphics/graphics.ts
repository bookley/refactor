/**
 * Created by Jamie on 04-Jul-15.
 */
import Shader = require("graphics/shaders");
import Mesh = require("graphics/mesh");
import MeshInstance = require("graphics/meshInstance");
import Texture = require("graphics/texture");
import Asset = require("graphics/assets/asset");
import AssetLoader = require("graphics/assets/assetLoader");
import AssetCollection = require("graphics/assets/assetCollection");
import TileMapRenderer = require("graphics/tileMapRenderer");
import TileMap = require("game/tileMap");
import ImageMap = require("graphics/imageMap");

/**
 * Responsible for initializing and maintaining the main WebGL context
 */
class Graphics {

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


    constructor(canvas:HTMLCanvasElement) {
        this.initGL(canvas)
        this.assetCollection = new AssetCollection(this.ctx);
        this.tileMapRenderer = new TileMapRenderer(this.ctx);
    }

    private initGL(canvas:HTMLCanvasElement):void{
        this.ctx = canvas.getContext("webgl");
        this.viewportWidth = canvas.width;
        this.viewportHeight = canvas.height;
        if (!this.ctx) alert("Error initializing WebGL context");
        this._lightDir = Graphics.DEFAULT_LIGHT_DIRECTION;
        this.ctx.clearColor(Graphics.DEFAULT_CLEAR_COLOR.r, Graphics.DEFAULT_CLEAR_COLOR.g, Graphics.DEFAULT_CLEAR_COLOR.b, Graphics.DEFAULT_CLEAR_COLOR.a);
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.disable(this.ctx.CULL_FACE);

        this.pMatrix = mat4.create();
        mat4.perspective(this.pMatrix, 45, this.viewportWidth / this.viewportHeight, 1, 100);
    }

    setBackground(r, g, b) {
        this.ctx.clearColor(r, g, b, 1.0);
    }

    SetAssets(assetLoader:AssetLoader) {
        this.assetCollection.setAssets(assetLoader);
    }

    createShader(shaderName:string, vShaderName:string, fShaderName:string, attributes:string[], uniforms:string[]) {
        this.assetCollection.createShader(shaderName, vShaderName, fShaderName, attributes, uniforms);
    }

    UseShader(shaderName) {
        this.currentShader = this.assetCollection.getShader(shaderName);
        this.currentShader.Activate();
    }

    SetLightDir(vec) {
        this._lightDir = vec;
    }

    /**
     * Draws the entities in the scenegraph
     * @param camera The camera to use when rendering the scene
     * @param scenegraph The scenegraph to interate over
     * @constructor
     */
    Draw(camera, scenegraph) {
        this.ctx.disableVertexAttribArray(3);
        /* Mesh position */
        this.currentShader.PassMatrix("uPMatrix", this.pMatrix);
        this.currentShader.PassVec3("lightDirection", this._lightDir);

        if (!camera) throw new Error("Can't draw if a camera isn't set");
        this.currentShader.PassMatrix("uCMatrix", camera.GetMatrix());
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

        this.ctx.disable(this.ctx.DEPTH_TEST);
        for (var i = 0; i < scenegraph.transparentGraph.length; i++) {
            var entity = scenegraph.transparentGraph[i];
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
    DebugDraw(camera, scenegraph){
        if(!Graphics.DRAW_DEBUG_INFO) return;

        this.currentShader.PassMatrix("uPMatrix", this.pMatrix);
        if (!camera) throw new Error("Can't draw if a camera isn't set");

        this.currentShader.PassMatrix("uCMatrix", camera.GetMatrix());
        for(var i = 0; i < scenegraph.debugGraph.length; i++){
            var line = scenegraph.debugGraph[i];
            line.Draw(this.currentShader, mat4.create());
        }


        for(var i = 0; i < scenegraph.graph.length; i++){
            var entity = scenegraph.graph[i];
            var modelMatrix = entity.getMatrix();
            entity.mesh.DrawNormals(this.currentShader, modelMatrix);
        }
    }

    InstancedDraw(camera){
        this.ctx.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        this.ctx.clear(this.ctx.DEPTH_BUFFER_BIT | this.ctx.COLOR_BUFFER_BIT);

        /* Mesh position */
        this.currentShader.PassMatrix("uPMatrix", this.pMatrix);
        this.currentShader.PassVec3("lightDirection", this._lightDir);

        if (!camera) throw new Error("Can't draw if a camera isn't set");
        this.currentShader.PassMatrix("uCMatrix", camera.GetMatrix());

        this.tileMapRenderer.draw(this.currentShader);
    }
}

export = Graphics;