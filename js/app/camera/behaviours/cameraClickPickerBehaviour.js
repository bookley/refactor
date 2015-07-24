define(["require", "exports", "input/mousePosition"], function (require, exports, MousePosition) {
    var CameraClickPickerBehaviour = (function () {
        function CameraClickPickerBehaviour(sceneGraph, camera) {
            this.sceneGraph = sceneGraph;
            this.camera = camera;
        }
        CameraClickPickerBehaviour.prototype.setViewportDimensions = function (width, height) {
            this.viewportWidth = width;
            this.viewportHeight = height;
        };
        CameraClickPickerBehaviour.prototype.getClipCameraPosition = function (position) {
            var x = ((position.x * 2) / this.viewportWidth) - 1;
            var y = 1.0 - ((position.y * 2) / this.viewportHeight);
            return new MousePosition.MousePosition(x, y);
        };
        CameraClickPickerBehaviour.prototype.onClick = function (position) {
            //console.log("Mouse position");
            //console.log(position);
            for (var i = 0; i < this.sceneGraph.graph.length; i++) {
                var entity = this.sceneGraph.graph[i];
                if (this.isClickOnEntity(this.getClipCameraPosition(position), entity, this.camera.GetMatrix())) {
                    alert("clicked!");
                }
            }
        };
        CameraClickPickerBehaviour.prototype.isClickOnEntity = function (click, entity, cameraMatrix) {
            //TODO: Figure out why ZNear has to be 1
            var perspective = mat4.create();
            mat4.perspective(perspective, 45, 800 / 600, 0.1, 100.0);
            //console.log(perspective);
            mat4.mul(perspective, perspective, cameraMatrix);
            var mouseClipNear = this.unproject(click.x, click.y, -1, perspective, [0, 0, 600, 600]);
            var mouseClipFar = this.unproject(click.x, click.y, 0, perspective, [0, 0, 600, 600]);
            var dir = vec3.create();
            vec3.sub(dir, mouseClipFar, mouseClipNear);
            vec3.normalize(dir, dir);
            var inverseCamera = mat4.create();
            mat4.invert(inverseCamera, cameraMatrix);
            var cameraPosition = vec3.fromValues(inverseCamera[12], inverseCamera[13], inverseCamera[14]);
            var result2 = vec3.create();
            vec3.copy(result2, dir);
            vec3.scale(result2, result2, 100);
            vec3.add(result2, cameraPosition, result2);
            this.sceneGraph.currentScene.drawDebugLine(cameraPosition, result2);
            var boundingCube = entity.getBoundingCube();
            boundingCube.transform(entity.getMatrix());
            //console.log(boundingCube);
            var result = this.testRayOBBIntersection(cameraPosition, dir, boundingCube);
            if (result) {
                console.log("hit");
            }
            else {
            }
        };
        CameraClickPickerBehaviour.prototype.testRayOBBIntersection = function (point, vector, box) {
            var values = ["x", "y", "z"];
            var tmin = 0;
            var tmax = 10000000;
            for (var i = 0; i < 3; i++) {
                if (Math.abs(vector[i]) < 0.0001) {
                    //parallel
                    if (point[i] < box.lowest[i] || point[i] > box.highest[i]) {
                        //console.log("Failed on containment check for " + values[i]);
                        return null;
                    }
                }
                else {
                    var ood = 1.0 / vector[i];
                    var t1 = (box.lowest[i] - point[i]) * ood;
                    var t2 = (box.highest[i] - point[i]) * ood;
                    //console.log("t1 " + t1 + " t2 " + t2);
                    if (t1 > t2) {
                        //swap
                        var w = t1;
                        t1 = t2;
                        t2 = w;
                    }
                    if (t1 > tmin)
                        tmin = t1;
                    if (t2 < tmax)
                        tmax = t2;
                    if (tmin > tmax) {
                        //console.log("Failed on min check for " + values[i]);
                        //console.log("With tmin: " + tmin + " tmax: " + tmax);
                        return null;
                    }
                }
            }
            var collisionPoint = vec3.create();
            vec3.scale(collisionPoint, vector, tmin);
            vec3.add(collisionPoint, collisionPoint, point);
            return collisionPoint;
        };
        /* unproject - convert screen coordinate to WebGL Coordinates
         *   winx, winy - point on the screen
         *   winz       - winz=0 corresponds to newPoint and winzFar corresponds to farPoint
         *   mat        - model-view-projection matrix
         *   viewport   - array describing the canvas [x,y,width,height]
         */
        CameraClickPickerBehaviour.prototype.unproject = function (winx, winy, winz, mat, viewport) {
            winz = 2 * winz - 1;
            var invMat = mat4.create();
            mat4.invert(invMat, mat);
            var n = vec4.fromValues(winx, winy, winz, 1);
            vec4.transformMat4(n, n, invMat);
            var n2 = vec3.fromValues(n[0] / n[3], n[1] / n[3], n[2] / n[3]);
            return n2;
        };
        return CameraClickPickerBehaviour;
    })();
    exports.CameraClickPickerBehaviour = CameraClickPickerBehaviour;
});
//# sourceMappingURL=cameraClickPickerBehaviour.js.map