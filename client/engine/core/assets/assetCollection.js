/**
 * Created by Jamie on 20-Jul-15.
 */
define(["require", "exports", "core/texture", "core/helpers/meshhelper", "core/shaders"], function (require, exports, Texture, MeshHelper, Shader) {
    /**
     * Responsible for turning a collection of resolved remote assets into real assets (Textures/Meshes etc.) and storing them
     */
    var AssetCollection = (function () {
        function AssetCollection(ctx) {
            this.ctx = ctx;
            this.meshHelper = new MeshHelper(this.ctx);
            this.meshes = [];
            this.textures = [];
            this.shaderFiles = [];
            this.shaders = [];
            this.fonts = [];
        }
        AssetCollection.prototype.setAssets = function (assetLoader) {
            var self = this;
            self.addMesh("square", this.meshHelper.makeSquare());
            assetLoader.getByType("mesh").forEach(function (meshAsset) {
                self.addMesh(meshAsset.name, self.meshHelper.CreateMeshFromAsset(meshAsset));
            });
            assetLoader.getByType("texture").forEach(function (textureAsset) {
                self.addTexture(textureAsset.name, new Texture(self.ctx, textureAsset.data));
            });
            assetLoader.getByType("shader").forEach(function (shaderAsset) {
                self.addShaderFile(shaderAsset.name, shaderAsset);
            });
            assetLoader.getByType("fnt").forEach(function (shaderAsset) {
                self.addShaderFile(shaderAsset.name, shaderAsset);
            });
        };
        AssetCollection.prototype.addMesh = function (name, mesh) {
            this.meshes[name] = mesh;
        };
        AssetCollection.prototype.addTexture = function (name, texture) {
            this.textures[name] = texture;
        };
        AssetCollection.prototype.addShaderFile = function (name, shaderFile) {
            this.shaderFiles[name] = shaderFile;
        };
        AssetCollection.prototype.addFont = function (name, fontFile) {
            this.fontsFiles[name] = fontFile;
        };
        AssetCollection.prototype.createShader = function (shaderName, vShaderName, fShaderName, attributes, uniforms) {
            var vShader = this.getShaderFile(vShaderName);
            var fShader = this.getShaderFile(fShaderName);
            var mainShader = new Shader(this.ctx, vShader.data, fShader.data);
            mainShader.LoadAttributes(attributes);
            mainShader.LoadUniforms(uniforms);
            this.shaders[shaderName] = mainShader;
        };
        AssetCollection.prototype.getMesh = function (meshName) {
            var mesh = this.meshes[meshName];
            if (mesh == null)
                throw new Error("Attempted to access mesh '" + meshName + "', but this mesh could not be found");
            return mesh;
        };
        AssetCollection.prototype.getTexture = function (textureName) {
            var texture = this.textures[textureName];
            if (texture == null)
                throw new Error("Attempted to access texture '" + textureName + "', but this texture could not be found");
            return texture;
        };
        AssetCollection.prototype.getShaderFile = function (shaderFileName) {
            var shaderFile = this.shaderFiles[shaderFileName];
            if (shaderFile == null)
                throw new Error("Attempted to access shaderFile '" + shaderFileName + "', but this shaderFile could not be found");
            return shaderFile;
        };
        AssetCollection.prototype.getShader = function (shaderName) {
            var shader = this.shaders[shaderName];
            if (shader == null)
                throw new Error("Attempted to access shader '" + shaderName + "', but this shader could not be found");
            return shader;
        };
        return AssetCollection;
    })();
    return AssetCollection;
});
//# sourceMappingURL=assetCollection.js.map