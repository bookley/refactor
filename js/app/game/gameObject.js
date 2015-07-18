/**
 * Created by Jamie on 02-Jul-15.
 */
define(["require", "exports"], function (require, exports) {
    var GameObject = (function () {
        function GameObject() {
            this.orientation = mat4.create();
            this.scaleX = 1;
            this.scaleY = 1;
            this.scaleZ = 1;
            this.setPosition(0, 0, 0);
        }
        GameObject.prototype.setMesh = function (mesh) {
            this.mesh = mesh;
        };
        GameObject.prototype.setTexture = function (texture) {
            this.texture = texture;
        };
        GameObject.prototype.getBoundingCube = function () {
            var boundingCube = this.mesh.getBoundingCube();
            boundingCube.transform(this.getMatrix());
            return boundingCube;
        };
        GameObject.prototype.setPosition = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        };
        GameObject.prototype.setScaleSingle = function (scale) {
            this.scaleX = scale;
            this.scaleY = scale;
            this.scaleZ = scale;
        };
        GameObject.prototype.setOrientation = function (orientation) {
            this.orientation = orientation;
        };
        GameObject.prototype.getMatrix = function () {
            var matrix = mat4.create();
            mat4.translate(matrix, matrix, vec3.fromValues(this.x, this.y, this.z));
            mat4.mul(matrix, matrix, this.orientation);
            var scale = mat4.create();
            mat4.scale(scale, scale, vec3.fromValues(this.scaleX, this.scaleY, this.scaleZ));
            mat4.mul(matrix, matrix, scale);
            return matrix;
        };
        GameObject.prototype.update = function (delta) {
        };
        return GameObject;
    })();
    exports.GameObject = GameObject;
});
//# sourceMappingURL=gameObject.js.map