/**
 * Created by Jamie on 20-Jul-15.
 */

import Texture = require("graphics/texture");
import Asset = require("graphics/assets/asset");
import Mesh = require("graphics/mesh");

class AssetCollection {
    meshes:Mesh.Mesh[];
    textures:Texture[];
    shaderFiles:Asset[];

    constructor(){
        this.meshes = [];
        this.textures = [];
        this.shaderFiles = [];
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
}

export = AssetCollection;