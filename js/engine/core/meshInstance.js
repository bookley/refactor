/**
 * Created by Jamie on 25-Jul-15.
 */
define(["require", "exports"], function (require, exports) {
    var MeshInstance = (function () {
        function MeshInstance(ctx) {
            this.ctx = ctx;
        }
        MeshInstance.prototype.setMesh = function (mesh) {
            this.mesh = mesh;
        };
        MeshInstance.prototype.setInstanceRepeatData = function (centers) {
            this.numberOfInstances = centers.length / 3;
            var centersFloat32Array = new Float32Array(centers);
            this.centerBuffer = this.ctx.createBuffer();
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.centerBuffer);
            this.ctx.bufferData(this.ctx.ARRAY_BUFFER, centersFloat32Array, this.ctx.STATIC_DRAW);
        };
        MeshInstance.prototype.Draw = function (shader, modelMatrix) {
            var ext = this.ctx.getExtension("ANGLE_instanced_arrays");
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.centerBuffer);
            this.ctx.vertexAttribPointer(shader.attributes["aModelCentre"], 3, this.ctx.FLOAT, false, 12, 0);
            ext.vertexAttribDivisorANGLE(shader.attributes["aModelCentre"], 1);
            this.mesh.bindBuffers(shader, modelMatrix);
            // draw the instanced meshes
            ext.drawElementsInstancedANGLE(this.ctx.TRIANGLES, this.mesh.numIndices, this.ctx.UNSIGNED_SHORT, 0, this.numberOfInstances);
            //todo: bind mesh's buffers (if not already bound)
            //todo: bind instance buffers
            //todo: draw instanced
        };
        return MeshInstance;
    })();
    return MeshInstance;
});
//# sourceMappingURL=meshInstance.js.map