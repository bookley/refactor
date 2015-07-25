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
            //todo: load buffers here
        };
        MeshInstance.prototype.Draw = function (shader, modelMatrix) {
            //todo: bind mesh's buffers (if not already bound)
            //todo: bind instance buffers
            //todo: draw instanced
        };
        return MeshInstance;
    })();
});
//# sourceMappingURL=meshInstance.js.map