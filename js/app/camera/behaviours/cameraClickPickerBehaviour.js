define(["require", "exports", "input/mousePosition"], function (require, exports, MousePosition) {
    var CameraClickPickerBehaviour = (function () {
        function CameraClickPickerBehaviour() {
        }
        CameraClickPickerBehaviour.prototype.setViewportDimensions = function (width, height) {
            this.viewportWidth = width;
            this.viewportHeight = height;
        };
        CameraClickPickerBehaviour.prototype.setScenegraph = function (sceneGraph) {
            this.sceneGraph = sceneGraph;
        };
        CameraClickPickerBehaviour.prototype.setCamera = function (camera) {
            this.camera = camera;
        };
        CameraClickPickerBehaviour.prototype.getClipCameraPosition = function (position) {
            var x = (position.x * 2.0) / this.viewportWidth - 1;
            var y = 1.0 - (position.y * 2) / this.viewportHeight;
            return new MousePosition.MousePosition(x, y);
        };
        CameraClickPickerBehaviour.prototype.onClick = function (position) {
            var clipPosition = this.getClipCameraPosition(position);
            for (var i = 0; i < this.sceneGraph.graph.length; i++) {
                var entity = this.sceneGraph.graph[i];
                if (this.isClickOnEntity(clipPosition, entity, this.camera.GetMatrix())) {
                    alert("clicked!");
                }
                else {
                }
            }
        };
        CameraClickPickerBehaviour.prototype.isClickOnEntity = function (click, entity, cameraMatrix) {
            var boundingCube = entity.getBoundingCube();
            var mouseClip = vec4.fromValues(click.x, click.y * 0.55, -1, 0);
            var inverseCamera = mat4.create();
            mat4.invert(inverseCamera, cameraMatrix);
            var cameraPosition = vec3.fromValues(inverseCamera[12], inverseCamera[13], inverseCamera[14]);
            var mouseVector = vec4.create();
            vec4.transformMat4(mouseVector, mouseClip, inverseCamera);
            vec4.normalize(mouseVector, mouseVector);
            var result = this.testRayOBBIntersection(cameraPosition, mouseVector, boundingCube);
            if (result) {
                console.log("hit");
                this.sceneGraph.currentScene.drawDebugLine(cameraPosition, result);
            }
            else {
                var endPos = vec3.create();
                var endPosDir = vec3.create();
                vec3.scale(endPosDir, mouseVector, 100);
                vec3.add(endPos, cameraPosition, endPosDir);
                this.sceneGraph.currentScene.drawDebugLine(cameraPosition, endPos);
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
                        console.log("Failed on containment check for " + values[i]);
                        return null;
                    }
                }
                else {
                    var ood = 1.0 / vector[i];
                    var t1 = (box.lowest[i] - point[i]) * ood;
                    var t2 = (box.highest[i] - point[i]) * ood;
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
                        console.log("Failed on min check for " + values[i]);
                        console.log("With tmin: " + tmin + " tmax: " + tmax);
                        return null;
                    }
                }
            }
            var collisionPoint = vec3.create();
            vec3.scale(collisionPoint, vector, tmin);
            vec3.add(collisionPoint, collisionPoint, point);
            return collisionPoint;
        };
        return CameraClickPickerBehaviour;
    })();
    exports.CameraClickPickerBehaviour = CameraClickPickerBehaviour;
});
//# sourceMappingURL=cameraClickPickerBehaviour.js.map