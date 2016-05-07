/**
 * Created by Jamie on 02-Aug-15.
 */
///<reference path="../../lib/gl-matrix.d.ts" />
define(["require", "exports"], function (require, exports) {
    var Ray = (function () {
        /**
         * @param x The xposition of the ray in clip space
         * @param y The yPosition of the ray in clip space
         */
        function Ray(x, y) {
            this.x = x;
            this.y = y;
        }
        /**
         * @param modelView The matrix representing the modelView
         */
        Ray.prototype.getInWorld = function (modelView) {
            var perspective = mat4.create();
            mat4.perspective(perspective, 45, 800 / 600, 0.1, 100.0);
            mat4.mul(perspective, perspective, modelView);
            var mouseClipNear = this.unproject(this.x, this.y, -1, perspective, [0, 0, 600, 600]);
            var mouseClipFar = this.unproject(this.x, this.y, 0, perspective, [0, 0, 600, 600]);
            var dir = vec3.create();
            vec3.sub(dir, mouseClipFar, mouseClipNear);
            vec3.normalize(dir, dir);
            return dir;
        };
        /**
         * @param modelView The matrix representing the modelView
         * @param yPosition (optional) raise the yPlane by the specified amount
         */
        Ray.prototype.getYPlaneIntersection = function (modelView, yPosition) {
            var dir = this.getInWorld(modelView);
            var inverseCamera = mat4.create();
            mat4.invert(inverseCamera, modelView);
            var cameraPosition = vec3.fromValues(inverseCamera[12], inverseCamera[13], inverseCamera[14]);
            var distance = -cameraPosition[1] / dir[1];
            vec3.scale(dir, dir, distance);
            var roundexX = Math.floor(cameraPosition[0] + dir[0]);
            var roundedZ = Math.floor(cameraPosition[2] + dir[2]);
            return [roundexX, 0, roundedZ];
        };
        Ray.prototype.unproject = function (winx, winy, winz, mat, viewport) {
            winz = 2 * winz - 1;
            var invMat = mat4.create();
            mat4.invert(invMat, mat);
            var n = vec4.fromValues(winx, winy, winz, 1);
            vec4.transformMat4(n, n, invMat);
            var n2 = vec3.fromValues(n[0] / n[3], n[1] / n[3], n[2] / n[3]);
            return n2;
        };
        return Ray;
    })();
    return Ray;
});
//# sourceMappingURL=ray.client.map