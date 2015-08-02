///<reference path="../../lib/gl-matrix.d.ts" />
define(["require", "exports"], function (require, exports) {
    var Camera = (function () {
        function Camera() {
            this.matrix = mat4.create();
            this.position = mat4.create();
            var vec = vec3.fromValues(0, 0, -10);
            mat4.translate(this.position, this.position, vec);
        }
        Camera.prototype.GetMatrix = function () {
            //return this.matrix;
            var result = mat4.create();
            return mat4.multiply(result, this.position, this.matrix);
            return result;
        };
        return Camera;
    })();
    exports.Camera = Camera;
});
//# sourceMappingURL=camera.js.map