/**
 * Created by Jamie on 20-Jul-15.
 */

import Texture = require("graphics/texture");
import Asset = require("graphics/assets/asset");
import AssetLoader = require("graphics/assets/assetLoader");
import Mesh = require("graphics/mesh");
import MeshHelper = require("graphics/helpers/meshhelper");
import Shader = require("graphics/shaders");

/**
 * Responsible for turning a collection of resolved remote assets into real assets (Textures/Meshes etc.) and storing them
 */
class AssetCollection {
    ctx:WebGLRenderingContext;
    meshHelper:MeshHelper;

    meshes:Mesh.Mesh[];
    textures:Texture[];
    shaderFiles:Asset[];
    shaders:Shader[];

    constructor(ctx:WebGLRenderingContext){
        this.ctx = ctx;
        this.meshHelper = new MeshHelper(this.ctx);

        this.meshes = [];
        this.textures = [];
        this.shaderFiles = [];
        this.shaders = [];
    }

    setAssets(assetLoader:AssetLoader) {
        var self = this;
        self.addMesh("square", this.meshHelper.makeSquare());

        assetLoader.getByType("mesh").forEach(function(meshAsset){
            self.addMesh(meshAsset.name, self.meshHelper.CreateMeshFromAsset(meshAsset));
        });


        assetLoader.getByType("texture").forEach(function(textureAsset){
            self.addTexture(textureAsset.name, new Texture(self.ctx, textureAsset.data));
        });

        assetLoader.getByType("shader").forEach(function(shaderAsset){
            self.addShaderFile(shaderAsset.name, shaderAsset);
        });
    }

    addMesh(name:string, mesh:Mesh.Mesh){
        this.meshes[name] = mesh;
    }

    addTexture(name:string, texture:Texture){
        this.textures[name] = texture;
    }

    addShaderFile(name:string, shaderFile:Asset){
        this.shaderFiles[name] = shaderFile;
    }

    createShader(shaderName:string, vShaderName:string, fShaderName:string, attributes:string[], uniforms:string[]) {
        var vShader = this.getShaderFile(vShaderName);
        var fShader = this.getShaderFile(fShaderName);
        var mainShader = new Shader(this.ctx, vShader.data, fShader.data);
        mainShader.LoadAttributes(attributes);
        mainShader.LoadUniforms(uniforms);
        this.shaders[shaderName] = mainShader;
    }

    getMesh(meshName):Mesh.Mesh {
        var mesh = this.meshes[meshName];
        if (mesh == null) throw new Error("Attempted to access mesh '" + meshName + "', but this mesh could not be found");
        return mesh;
    }

    getTexture(textureName):Texture {
        var texture = this.textures[textureName];
        if (texture == null) throw new Error("Attempted to access texture '" + textureName + "', but this texture could not be found");
        return texture;
    }

    getShaderFile(shaderFileName):Asset{
        var shaderFile = this.shaderFiles[shaderFileName];
        if (shaderFile == null) throw new Error("Attempted to access shaderFile '" + shaderFileName + "', but this shaderFile could not be found");
        return shaderFile;
    }

    getShader(shaderName):Shader {
        var shader = this.shaders[shaderName];
        if (shader == null) throw new Error("Attempted to access shader '" + shaderName + "', but this shader could not be found");
        return shader;
    }
}

export = AssetCollection;