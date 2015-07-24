define(["require", "exports", "graphics/mesh"], function (require, exports, Mesh) {
    var MeshHelper = (function () {
        function MeshHelper(ctx) {
            this.ctx = ctx;
        }
        MeshHelper.prototype.makeSquare = function () {
            var vertices = [
                -1.0,
                -1.0,
                0.0,
                1.0,
                -1.0,
                0.0,
                1.0,
                1.0,
                0.0,
                -1.0,
                1.0,
                0.0
            ]; //top left
            var indices = [0, 1, 2, 0, 2, 3];
            var colors = [
                1.0,
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
                1.0,
                0.0,
                0.0,
            ];
            var normals = [
                0.0,
                0.0,
                -1.0,
                0.0,
                0.0,
                -1.0,
                0.0,
                0.0,
                -1.0,
                0.0,
                0.0,
                -1.0,
            ];
            var texCoords = [
                0.0,
                1.0,
                1.0,
                1.0,
                1.0,
                0.0,
                0.0,
                0.0,
            ];
            var mesh = new Mesh.Mesh(this.ctx);
            mesh.LoadVertices(vertices, indices, colors, normals, texCoords);
            return mesh;
        };
        MeshHelper.prototype.CreateSquare = function () {
            var mesh = new Mesh.Mesh(this.ctx);
            mesh.MakeSquare();
            return mesh;
        };
        MeshHelper.prototype.CreateMeshFromAsset = function (asset) {
            var mesh = new Mesh.Mesh(this.ctx);
            mesh.LoadVerticesFromFile(asset.data);
            return mesh;
        };
        return MeshHelper;
    })();
    exports.MeshHelper = MeshHelper;
});
//# sourceMappingURL=meshhelper.js.map