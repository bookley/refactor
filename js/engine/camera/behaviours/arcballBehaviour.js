///<reference path="../../../lib/gl-matrix.d.ts" />
define(["require", "exports"], function (require, exports) {
    var Arcball = (function () {
        function Arcball() {
            this.xRot = 0;
            this.yRot = 0;
        }
        Arcball.prototype._GetArcballVector = function (x, y) {
            var vec = vec3.fromValues(1 * x / 800 * 2 - 1, 1 * y / 600 * 2 - 1, 0);
            vec[1] *= -1;
            var OP_squared = vec[0] * vec[0] + vec[1] * vec[1];
            if (OP_squared <= 1 * 1) {
                vec[2] = Math.sqrt(1 * 1 - OP_squared); // Pythagore
            }
            else {
            }
            return vec;
        };
        Arcball.prototype.CalculateMoveMatrix = function (pointA, pointB) {
            var result = mat4.create();
            var prevCameraVector = this._GetArcballVector(pointA.x, pointA.y);
            var nextCameraVector = this._GetArcballVector(pointB.x, pointB.y);
            var prevCameraVectorX = vec3.fromValues(0, prevCameraVector[1], prevCameraVector[2]);
            vec3.normalize(prevCameraVectorX, prevCameraVectorX);
            var nextCameraVectorX = vec3.fromValues(0, nextCameraVector[1], nextCameraVector[2]);
            vec3.normalize(nextCameraVectorX, nextCameraVectorX);
            var xAngle = Math.acos(Math.min(1.0, vec3.dot(prevCameraVectorX, nextCameraVectorX)));
            if (nextCameraVector[1] - prevCameraVector[1] < 0) {
                this.xRot += xAngle;
            }
            else if (nextCameraVector[1] - prevCameraVector[1] > 0) {
                this.xRot -= xAngle;
            }
            if (this.xRot > Math.PI * 2) {
                this.xRot = 0;
            }
            if (this.xRot < 0) {
                this.xRot = Math.PI * 2;
            }
            mat4.rotate(result, result, this.xRot, vec3.fromValues(1, 0, 0));
            var prevCameraVectorY = vec3.fromValues(prevCameraVector[0], 0, prevCameraVector[2]);
            vec3.normalize(prevCameraVectorY, prevCameraVectorY);
            var nextCameraVectorY = vec3.fromValues(nextCameraVector[0], 0, nextCameraVector[2]);
            vec3.normalize(nextCameraVectorY, nextCameraVectorY);
            var yAngle = Math.acos(Math.min(1.0, vec3.dot(prevCameraVectorY, nextCameraVectorY)));
            if (nextCameraVector[0] - prevCameraVector[0] < 0) {
                this.yRot -= yAngle;
            }
            else if (nextCameraVector[0] - prevCameraVector[0] > 0) {
                this.yRot += yAngle;
            }
            if (this.yRot > Math.PI * 2) {
                this.yRot = 0;
            }
            if (this.yRot < 0) {
                this.yRot = Math.PI * 2;
            }
            mat4.rotate(result, result, this.yRot, vec3.fromValues(0, 1, 0));
            return result;
        };
        return Arcball;
    })();
    exports.Arcball = Arcball;
});
//# sourceMappingURL=arcballBehaviour.js.map