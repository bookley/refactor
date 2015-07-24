/**
 * Created by Jamie on 04-Jul-15.
 */
import Shaders = require("graphics/shaders");
import Mesh = require("graphics/mesh");
import MeshHelpers = require("graphics/helpers/meshhelper");
import Texture = require("graphics/texture");
import Asset = require("graphics/assets/asset");
import AssetLoader = require("graphics/assets/assetLoader");
import AssetCollection = require("graphics/assets/assetCollection");

export class Graphics {
    ctx:WebGLRenderingContext;
    viewportWidth:number;
    viewportHeight:number;

    pMatrix:Float32Array;
    mvMatrix:Float32Array;

    _lightDir:number[];
    _shaders:Shaders.Shader[];

    _meshAssets:Asset.Asset[];
    _textureAssets:Asset.Asset[];

    meshes:Mesh.Mesh[];
    textures:Texture.Texture[];
    currentShader:Shaders.Shader;

    assetCollection:AssetCollection.AssetCollection;
    meshHelper:MeshHelpers.MeshHelper;


    constructor(canvas) {
        this.ctx = canvas.getContext("webgl");
        this.meshHelper = new MeshHelpers.MeshHelper(this.ctx);
        this.assetCollection = new AssetCollection.AssetCollection();

        this.viewportWidth = canvas.width;
        this.viewportHeight = canvas.height;
        if (!this.ctx) alert("Error initializing WebGL context");

        this._shaders = [];
        this._meshAssets = [];
        this.meshes = [];
        this.textures = [];

        this._lightDir = [0.0, 0.0, 1.0];

        this.ctx.clearColor(0.0, 0.2, 0.0, 1.0);
        this.ctx.enable(this.ctx.DEPTH_TEST);

        this.pMatrix = mat4.create();
        mat4.perspective(this.pMatrix, 45, this.viewportWidth / this.viewportHeight, 1, 100);
        this.mvMatrix = mat4.create();
    }

    setBackground(r, g, b) {
        this.ctx.clearColor(r, g, b, 1.0);
    }

    SetAssets(assetLoader:AssetLoader.AssetLoader) {
        var self = this;
        assetLoader.getByType("mesh").forEach(function(meshAsset){
            self.assetCollection.addMesh(meshAsset.name, self.meshHelper.CreateMeshFromAsset(meshAsset));
        });
        self.assetCollection.addMesh("square", this.meshHelper.CreateSquare());

        assetLoader.getByType("texture").forEach(function(textureAsset){
            self.assetCollection.addTexture(textureAsset.name, new Texture.Texture(self.ctx, textureAsset.data));
        });

        assetLoader.getByType("shader").forEach(function(shaderAsset){
            self.assetCollection.addShaderFile(shaderAsset.name, shaderAsset);
        });
    }

    createShader(shaderName, vShaderName, fShaderName, attributes, uniforms) {
        var vShader = this.assetCollection.getShaderFile(vShaderName);
        var fShader = this.assetCollection.getShaderFile(fShaderName);
        var mainShader = new Shaders.Shader(this.ctx, vShader.data, fShader.data);
        mainShader.LoadAttributes(attributes);
        mainShader.LoadUniforms(uniforms);
        this._shaders[shaderName] = mainShader;
    }

    UseShader(shaderName) {
        this._shaders[shaderName].Activate();
        this.currentShader = this._shaders[shaderName];
    }

    SetLightDir(vec) {
        this._lightDir = vec;
    }

    Draw(camera, scenegraph) {
        this.ctx.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        this.ctx.clear(this.ctx.DEPTH_BUFFER_BIT | this.ctx.COLOR_BUFFER_BIT);

        /* Mesh position */
        this.currentShader.PassMatrix("uPMatrix", this.pMatrix);
        this.currentShader.PassVec3("lightDirection", this._lightDir);

        if (!camera) throw new Error("Can't draw if a camera isn't set");
        // console.log(camera.GetMatrix());
        this.currentShader.PassMatrix("uCMatrix", camera.GetMatrix());

        for (var i = 0; i < scenegraph.graph.length; i++) {
            var entity = scenegraph.graph[i];

            var modelMatrix = entity.getMatrix();
            if (entity.texture != null) {
                entity.texture.Bind();
                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, entity.mesh.texturePositionBuffer);
                this.ctx.vertexAttribPointer(this.currentShader.attributes["aTexCoords"], 2, this.ctx.FLOAT, false, 0, 0);
            }
            entity.mesh.Draw(this.currentShader, modelMatrix);
        }
    }

    DebugDraw(camera, scenegraph){
        this.currentShader.PassMatrix("uPMatrix", this.pMatrix);
        if (!camera) throw new Error("Can't draw if a camera isn't set");
        // console.log(camera.GetMatrix());
        this.currentShader.PassMatrix("uCMatrix", camera.GetMatrix());
        for(var i = 0; i < scenegraph.debugGraph.length; i++){
            var line = scenegraph.debugGraph[i];
            line.Draw(this.currentShader, mat4.create());
        }

        if(true) return;

        for(var i = 0; i < scenegraph.graph.length; i++){
            var entity = scenegraph.graph[i];
            var modelMatrix = entity.getMatrix();
            entity.mesh.DrawNormals(this.currentShader, modelMatrix);
        }
    }
}