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
            var x = ((position.x * 2) / this.viewportWidth) - 1;
            var y = 1.0 - ((position.y * 2) / this.viewportHeight);
            return new MousePosition.MousePosition(x, y);
        };
        CameraClickPickerBehaviour.prototype.onClick = function (position) {
            console.log("Mouse position");
            console.log(position);
            for (var i = 0; i < this.sceneGraph.graph.length; i++) {
                var entity = this.sceneGraph.graph[i];
                if (this.isClickOnEntity(this.getClipCameraPosition(position), entity, this.camera.GetMatrix())) {
                    alert("clicked!");
                }
            }
        };
        CameraClickPickerBehaviour.prototype.isClickOnEntity = function (click, entity, cameraMatrix) {
            var boundingCube = entity.getBoundingCube();
            console.log("Clip3");
            console.log(click);
            var mouseClipNear = vec4.fromValues(click.x, click.y, -100, 1);
            var transform = mat4.create();
            var perspective = mat4.create();
            mat4.perspective(perspective, 45, 600 / 600, 0.01, 100);
            mat4.mul(transform, cameraMatrix, perspective);
            mat4.invert(transform, transform);
            var inverseCamera = mat4.create();
            mat4.invert(inverseCamera, cameraMatrix);
            var cameraPosition = vec3.fromValues(inverseCamera[12], inverseCamera[13], inverseCamera[14]);
            vec4.transformMat4(mouseClipNear, mouseClipNear, transform);
            console.log("After");
            var result = vec3.fromValues(mouseClipNear[0], mouseClipNear[1], mouseClipNear[2]);
            vec3.normalize(result, result);
            console.log(result);
            console.log("Camera");
            console.log(cameraPosition);
            var toTopLeft = vec3.fromValues(-1, 1, 0);
            vec3.subtract(toTopLeft, toTopLeft, cameraPosition);
            vec3.normalize(toTopLeft, toTopLeft);
            console.log("To Top Left");
            console.log(toTopLeft);
            vec3.scale(result, result, 10);
            vec3.add(result, cameraPosition, result);
            this.sceneGraph.currentScene.drawDebugLine(cameraPosition, result);
            /*
    
            var result = this.testRayOBBIntersection(mouseClipNear, n, boundingCube);
            //if(result) {
              //  console.log("hit");
                //this.sceneGraph.currentScene.drawDebugLine(cameraPosition, result);
            //} else {
                var endPos = vec3.create();
                var endPosDir = vec3.create();
                vec3.scale(endPosDir, n, 100);
                vec3.add(endPos, mouseClipNear, mouseClipFar);
                this.sceneGraph.currentScene.drawDebugLine(cameraPosition, mouseClipFar);
            //}
            */
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
        return CameraClickPickerBehaviour;
    })();
    exports.CameraClickPickerBehaviour = CameraClickPickerBehaviour;
});
//# sourceMappingURL=cameraClickPickerBehaviour.js.map