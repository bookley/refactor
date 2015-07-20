/**
 * Created by Jamie on 02-Jul-15.
 */
define(["require", "exports", "graphics/filetypes/objloader", "graphics/debugLine"], function (require, exports, ObjLoader, DebugLine) {
    ///<reference path="../../lib/gl-matrix.d.ts" />
    var Mesh = (function () {
        function Mesh(ctx) {
            this.ctx = ctx;
            this.vertexBuffer = ctx.createBuffer();
            this.colorBuffer = ctx.createBuffer();
            this.indexBuffer = ctx.createBuffer();
            this.normalBuffer = ctx.createBuffer();
            this.texturePositionBuffer = ctx.createBuffer();
            this.normalLines = [];
        }
        Mesh.prototype.LoadVerticesFromFile = function (file) {
            var modelData = new ObjLoader.ObjLoader().readFile(file);
            this.LoadVertices(modelData.vertices, modelData.indices, modelData.colors, modelData.normals, modelData.texCoords);
        };
        Mesh.prototype.LoadVertices = function (vertices, indices, colors, normals, texCoords) {
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
            this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(vertices), this.ctx.STATIC_DRAW);
            this.vertices = vertices;
            this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.ctx.STATIC_DRAW);
            if (colors != undefined) {
                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.colorBuffer);
                this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(colors), this.ctx.STATIC_DRAW);
            }
            if (normals != undefined) {
                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normalBuffer);
                this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(normals), this.ctx.STATIC_DRAW);
                this.normals = normals;
                this.createNormalLines();
            }
            if (texCoords != undefined) {
                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.texturePositionBuffer);
                this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(texCoords), this.ctx.STATIC_DRAW);
            }
            this.numIndices = indices.length;
        };
        Mesh.prototype.createNormalLines = function () {
            for (var i = 0; i < this.vertices.length; i += 3) {
                var line = new DebugLine.DebugLine(this.ctx, vec3.fromValues(this.vertices[i], this.vertices[i + 1], this.vertices[i + 2]), vec3.fromValues(this.vertices[i] + this.normals[i], this.vertices[i + 1] + this.normals[i + 1], this.vertices[i + 2] + this.normals[i + 2]));
                this.normalLines.push(line);
            }
        };
        Mesh.prototype.MakeSquare = function () {
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
            this.LoadVertices(vertices, indices, colors, normals, texCoords);
        };
        Mesh.prototype.MakeCube = function () {
            var vertices = [
                -1.0,
                -1.0,
                1.0,
                1.0,
                -1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                -1.0,
                1.0,
                1.0,
                -1.0,
                -1.0,
                -1.0,
                -1.0,
                1.0,
                -1.0,
                1.0,
                1.0,
                -1.0,
                1.0,
                -1.0,
                -1.0,
                -1.0,
                1.0,
                -1.0,
                -1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                -1.0,
                -1.0,
                -1.0,
                -1.0,
                1.0,
                -1.0,
                -1.0,
                1.0,
                -1.0,
                1.0,
                -1.0,
                -1.0,
                1.0,
                1.0,
                -1.0,
                -1.0,
                1.0,
                1.0,
                -1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                -1.0,
                1.0,
                -1.0,
                -1.0,
                -1.0,
                -1.0,
                -1.0,
                1.0,
                -1.0,
                1.0,
                1.0,
                -1.0,
                1.0,
                -1.0
            ];
            var colors4 = [
                1.0,
                0.0,
                0.0,
                0.0,
                0.0,
                1.0,
                0.0,
                1.0,
                0.0,
                1.0,
                0.0,
                1.0,
                1.0,
                1.0,
                0.0,
                0.5,
                0.5,
                0.5,
            ];
            var colors = [];
            for (var i = 0; i < 6; i++) {
                for (var c = 0; c < 4; c++) {
                    var x = colors4.slice(i * 3, i * 3 + 3);
                    colors = colors.concat(x);
                }
            }
            var indices = [
                0,
                1,
                2,
                0,
                2,
                3,
                4,
                5,
                6,
                4,
                6,
                7,
                8,
                9,
                10,
                8,
                10,
                11,
                12,
                13,
                14,
                12,
                14,
                15,
                16,
                17,
                18,
                16,
                18,
                19,
                20,
                21,
                22,
                20,
                22,
                23
            ];
            this.LoadVertices(vertices, indices, colors, null, null);
        };
        Mesh.prototype.DrawNormals = function (shader, modelMatrix) {
            for (var i = 0; i < this.normalLines.length; i++) {
                this.normalLines[i].Draw(shader, modelMatrix);
            }
        };
        Mesh.prototype.Draw = function (shader, modelMatrix) {
            //Need to have texture//colours bound at this point
            //if this.material -> this.material.bind
            //add something to notify if shader.attributes["name"] doesn't exist
            //console.log("drawing");
            shader.PassMatrix("uMVMatrix", modelMatrix);
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
            this.ctx.vertexAttribPointer(shader.attributes["aVertexPosition"], 3, this.ctx.FLOAT, false, 0, 0);
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normalBuffer);
            this.ctx.vertexAttribPointer(shader.attributes["aVertexNormal"], 3, this.ctx.FLOAT, false, 0, 0);
            this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            this.ctx.drawElements(this.ctx.TRIANGLES, this.numIndices, this.ctx.UNSIGNED_SHORT, 0);
        };
        Mesh.prototype.getBoundingCube = function () {
            var boundingCube = new BoundingCube();
            for (var i = 0; i < this.vertices.length / 3; i++) {
                var currentVertex = {
                    x: this.vertices[i * 3],
                    y: this.vertices[i * 3 + 1],
                    z: this.vertices[i * 3 + 2]
                };
                if (currentVertex.x < boundingCube.lowest[0])
                    boundingCube.lowest[0] = currentVertex.x;
                if (currentVertex.x > boundingCube.highest[0])
                    boundingCube.highest[0] = currentVertex.x;
                if (currentVertex.y < boundingCube.lowest[1])
                    boundingCube.lowest[1] = currentVertex.y;
                if (currentVertex.y > boundingCube.highest[1])
                    boundingCube.highest[1] = currentVertex.y;
                if (currentVertex.z < boundingCube.lowest[2])
                    boundingCube.lowest[2] = currentVertex.z;
                if (currentVertex.z > boundingCube.highest[2])
                    boundingCube.highest[2] = currentVertex.z;
            }
            ;
            return boundingCube;
        };
        return Mesh;
    })();
    exports.Mesh = Mesh;
    var BoundingCube = (function () {
        function BoundingCube() {
            this.lowest = vec3.create();
            this.highest = vec3.create();
        }
        BoundingCube.prototype.transform = function (matrix) {
            vec3.transformMat4(this.lowest, this.lowest, matrix);
            vec3.transformMat4(this.highest, this.highest, matrix);
        };
        return BoundingCube;
    })();
    exports.BoundingCube = BoundingCube;
});
//# sourceMappingURL=mesh.js.map