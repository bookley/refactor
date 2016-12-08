"use strict";
var mesh_1 = require("../mesh");
/**
 * Created by Jamie on 20-Jul-15.
 */
var MeshHelper = (function () {
    function MeshHelper(ctx) {
        this.ctx = ctx;
    }
    MeshHelper.prototype.makeSquare = function () {
        return this.makeSquareFromPosition([0, 0, 0], 1);
    };
    MeshHelper.prototype.makeSquareFromPosition = function (position, size) {
        var left = position[0];
        var bottom = position[2];
        var right = position[0] + size;
        var top = position[2] + size;
        var y = position[1];
        var vertices = [
            // Front face
            left, y, bottom,
            right, y, bottom,
            right, y, top,
            left, y, top]; //top left
        var indices = [0, 1, 2, 0, 2, 3];
        var normals = [
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
        ];
        var texCoords = [
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0,
            0.0, 0.0,
        ];
        var mesh = new mesh_1.Mesh(this.ctx);
        mesh.LoadVertices(vertices, indices, null, normals, texCoords);
        return mesh;
    };
    MeshHelper.prototype.CreateMeshFromAsset = function (asset) {
        var mesh = new mesh_1.Mesh(this.ctx);
        mesh.LoadVerticesFromFile(asset.data);
        return mesh;
    };
    return MeshHelper;
}());
module.exports = MeshHelper;
//# sourceMappingURL=MeshHelper.js.map