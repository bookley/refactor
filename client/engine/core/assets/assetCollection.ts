
import MeshHelper = require("../helpers/MeshHelper");
import Texture = require("../texture");
import {Mesh} from "../mesh";
import {Asset} from "./asset";
import Shader = require("../shaders");
import Font = require("../font");
import {AssetLoader} from "./assetLoader";
/**
 * Responsible for turning a collection of resolved remote assets into real assets (Textures/Meshes etc.) and storing them
 */
export class AssetCollection {
    ctx:WebGLRenderingContext;
    meshHelper:MeshHelper;

    meshes:Mesh[];
    textures:Texture[];
    shaderFiles:Asset[];
    shaders:Shader[];
    fontsFiles:Font[];

    constructor(ctx:WebGLRenderingContext){
        this.ctx = ctx;
        this.meshHelper = new MeshHelper(this.ctx);

        this.meshes = [];
        this.textures = [];
        this.shaderFiles = [];
        this.shaders = [];
        this.fontsFiles = [];
    }

    setAssets(assets:Array<Asset>) {
        this.addMesh("square", this.meshHelper.makeSquare());
        assets.forEach((asset) => {
           if(asset.type == "mesh")
               this.addMesh(asset.name, this.meshHelper.CreateMeshFromAsset(asset));
           if(asset.type == "texture")
               this.addTexture(asset.name, new Texture(this.ctx, asset.data));
           if(asset.type == "shader")
               this.addShaderFile(asset.name, asset);
        });
    }

    addMesh(name:string, mesh:Mesh){
        this.meshes[name] = mesh;
    }

    addTexture(name:string, texture:Texture){
        this.textures[name] = texture;
    }

    addShaderFile(name:string, shaderFile:Asset){
        this.shaderFiles[name] = shaderFile;
    }

    createShader(options:ShaderOptions) {
        var vShader = this.getShaderFile(options.vertexShaderFile);
        var fShader = this.getShaderFile(options.fragmentShaderFile);
        var mainShader = new Shader(this.ctx, vShader.data, fShader.data);
        mainShader.loadAttributes(options.attributeNames);
        mainShader.loadUniforms(options.uniformNames);
        this.shaders[options.name] = mainShader;
    }

    public getMesh(meshName): Mesh {
        var mesh = this.meshes[meshName];
        if (mesh == null) throw new Error("Attempted to access mesh '" + meshName + "', but this mesh could not be found");
        return mesh;
    }

    public getTexture(textureName): Texture {
        var texture = this.textures[textureName];
        if (texture == null) throw new Error("Attempted to access texture '" + textureName + "', but this texture could not be found");
        return texture;
    }

    public getShaderFile(shaderFileName): Asset{
        var shaderFile = this.shaderFiles[shaderFileName];
        if (shaderFile == null) throw new Error("Attempted to access shaderFile '" + shaderFileName + "', but this shaderFile could not be found");
        return shaderFile;
    }

    public getShader(shaderName): Shader {
        var shader = this.shaders[shaderName];
        if (shader == null) throw new Error("Attempted to access shader '" + shaderName + "', but this shader could not be found");
        return shader;
    }
}

export interface ShaderOptions {
    name: string;
    vertexShaderFile: string;
    fragmentShaderFile: string;
    attributeNames: string[];
    uniformNames: string[];
}