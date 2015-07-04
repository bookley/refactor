/**
 * Created by Jamie on 02-Jul-15.
 */
define(["require", "exports", "graphics/filetypes/objloader"], function (require, exports, ObjLoader) {
    ///<reference path="../../lib/gl-matrix.d.ts" />
    var Mesh = (function () {
        function Mesh(ctx) {
            this.ctx = ctx;
            this.vertexBuffer = ctx.createBuffer();
            this.colorBuffer = ctx.createBuffer();
            this.indexBuffer = ctx.createBuffer();
            this.normalBuffer = ctx.createBuffer();
            this.texturePositionBuffer = ctx.createBuffer();
        }
        Mesh.prototype.LoadVerticesFromFile = function (file) {
            var modelData = new ObjLoader.ObjLoader().readFile(file);
            this.LoadVertices(modelData.vertices, modelData.indices, modelData.colors, modelData.normals, modelData.texCoords);
        };
        Mesh.prototype.LoadVertices = function (vertices, indices, colors, normals, texCoords) {
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
            this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(vertices), this.ctx.STATIC_DRAW);
            this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.ctx.STATIC_DRAW);
            if (colors != undefined) {
                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.colorBuffer);
                this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(colors), this.ctx.STATIC_DRAW);
            }
            if (normals != undefined) {
                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normalBuffer);
                this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(normals), this.ctx.STATIC_DRAW);
            }
            if (texCoords != undefined) {
                this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.texturePositionBuffer);
                this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(texCoords), this.ctx.STATIC_DRAW);
            }
            this.numIndices = indices.length;
        };
        Mesh.prototype.MakeSquare = function () {
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
                1.0
            ]; //top left
            var indices = [
                0,
                1,
                2,
                0,
                2,
                3
            ];
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
        Mesh.prototype.Draw = function (shader, modelMatrix) {
            //Need to have texture//colours bound at this point
            //if this.material -> this.material.bind
            //add something to notify if shader.attributes["name"] doesn't exist
            //console.log("drawing");
            shader.PassMatrix("uMVMatrix", modelMatrix);
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
            this.ctx.vertexAttribPointer(shader.attributes["aVertexPosition"], 3, this.ctx.FLOAT, false, 0, 0);
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.colorBuffer);
            this.ctx.vertexAttribPointer(shader.attributes["aVertexColour"], 3, this.ctx.FLOAT, false, 0, 0);
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normalBuffer);
            this.ctx.vertexAttribPointer(shader.attributes["aVertexNormal"], 3, this.ctx.FLOAT, false, 0, 0);
            this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            this.ctx.drawElements(this.ctx.TRIANGLES, this.numIndices, this.ctx.UNSIGNED_SHORT, 0);
        };
        Mesh.prototype.getBoundingCube = function (vertices) {
            var boundingCube = new BoundingCube();
            for (var i = 0; i < vertices.length; i += 3) {
                var currentVertex = {
                    x: vertices[i * 3],
                    y: vertices[i * 3 + 1],
                    z: vertices[i * 3 + 2]
                };
                if (currentVertex.x < boundingCube.lowestX)
                    boundingCube.lowestX = currentVertex.x;
                if (currentVertex.x > boundingCube.highestX)
                    boundingCube.highestX = currentVertex.x;
                if (currentVertex.y < boundingCube.lowestY)
                    boundingCube.lowestY = currentVertex.y;
                if (currentVertex.y > boundingCube.highestY)
                    boundingCube.highestY = currentVertex.y;
                if (currentVertex.z < boundingCube.lowestZ)
                    boundingCube.lowestZ = currentVertex.z;
                if (currentVertex.z > boundingCube.highestZ)
                    boundingCube.highestZ = currentVertex.z;
            }
            ;
            return boundingCube;
        };
        return Mesh;
    })();
    exports.Mesh = Mesh;
    var BoundingCube = (function () {
        function BoundingCube() {
            this.lowestX = 0;
            this.highestX = 0;
            this.lowestY = 0;
            this.highestY = 0;
            this.lowestZ = 0;
            this.highestZ = 0;
        }
        return BoundingCube;
    })();
    exports.BoundingCube = BoundingCube;
});
//# sourceMappingURL=mesh.js.map