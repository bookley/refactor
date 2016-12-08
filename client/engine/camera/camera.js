///<reference path="../../lib/gl-matrix.d.ts" />
"use strict";
var Camera = (function () {
    //TODO: Camera needs a focal point and a camera point, needs to be possible to set both
    function Camera(width, height, fov, znear, zfar) {
        this.matrix = mat4.create();
        this.position = mat4.create();
        this.perspectiveMatrix = mat4.create();
        var vec = vec3.fromValues(0, -2, -10);
        mat4.translate(this.position, this.position, vec);
        mat4.perspective(this.perspectiveMatrix, fov, width / height, znear, zfar);
    }
    Camera.prototype.getMatrix = function () {
        var result = mat4.create();
        mat4.multiply(result, this.position, this.matrix);
        return result;
    };
    Camera.prototype.getPerspectiveMatrix = function () {
        return this.perspectiveMatrix;
    };
    Camera.prototype.setMatrix = function (matrix) {
        this.matrix = matrix;
    };
    return Camera;
}());
exports.Camera = Camera;
//# sourceMappingURL=camera.js.map