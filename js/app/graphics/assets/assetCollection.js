/**
 * Created by Jamie on 20-Jul-15.
 */
define(["require", "exports"], function (require, exports) {
    var AssetCollection = (function () {
        function AssetCollection() {
            this.meshes = [];
            this.textures = [];
            this.shaderFiles = [];
        }
        AssetCollection.prototype.addMesh = function (name, mesh) {
            this.meshes[name] = mesh;
        };
        AssetCollection.prototype.addTexture = function (name, texture) {
            this.textures[name] = texture;
        };
        AssetCollection.prototype.addShaderFile = function (name, shaderFile) {
            this.shaderFiles[name] = shaderFile;
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
        return AssetCollection;
    })();
    exports.AssetCollection = AssetCollection;
});
//# sourceMappingURL=assetCollection.js.map