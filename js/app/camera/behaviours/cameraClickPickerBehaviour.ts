///<reference path="../../../lib/gl-matrix.d.ts" />
import ClickBehaviour = require("camera/behaviours/clickBehaviour");
import MousePosition = require("input/mousePosition");
import Scenegraph = require("game/sceneGraph");
import Camera = require("camera/camera");
import GameObject = require("game/gameObject");
import Mesh = require("graphics/mesh");

export class CameraClickPickerBehaviour implements ClickBehaviour.CameraClickBehaviour {
    viewportWidth:number;
    viewportHeight:number;
    sceneGraph:Scenegraph.Scenegraph;
    camera:Camera.Camera;

    constructor(){

    }

    setViewportDimensions(width:number, height:number):void{
        this.viewportWidth = width;
        this.viewportHeight = height;
    }

    setScenegraph(sceneGraph:Scenegraph.Scenegraph){
        this.sceneGraph = sceneGraph;
    }

    setCamera(camera:Camera.Camera){
        this.camera = camera;
    }

    private getClipCameraPosition(position:MousePosition.MousePosition) : MousePosition.MousePosition {
        var x:number = (position.x * 2.0) / this.viewportWidth - 1;
        var y:number = 1.0 - (position.y * 2) / this.viewportHeight;
        return new MousePosition.MousePosition(x, y);
    }

    onClick(position:MousePosition.MousePosition): void {
        var clipPosition:MousePosition.MousePosition = this.getClipCameraPosition(position);
        for(var i = 0; i < this.sceneGraph.graph.length; i++){
            var entity = this.sceneGraph.graph[i];
            if(this.isClickOnEntity(clipPosition, entity, this.camera.GetMatrix())){
                alert("clicked!");
            } else {

            }
        }
    }

    isClickOnEntity(click:MousePosition.MousePosition, entity:GameObject.GameObject, cameraMatrix:Float32Array){
        var boundingCube:Mesh.BoundingCube = entity.getBoundingCube();

        var mouseClip:Float32Array = vec4.fromValues(click.x, click.y * 0.55, -1, 0);
        var inverseCamera = mat4.create(); mat4.invert(inverseCamera, cameraMatrix);
        var cameraPosition = vec3.fromValues(inverseCamera[12], inverseCamera[13], inverseCamera[14]);

        var mouseVector = vec4.create();
        vec4.transformMat4(mouseVector, mouseClip, inverseCamera);
        vec4.normalize(mouseVector, mouseVector);

        var result = this.testRayOBBIntersection(cameraPosition, mouseVector, boundingCube);
        if(result) {
            console.log("hit");
            this.sceneGraph.currentScene.drawDebugLine(cameraPosition, result);
        } else {
            var endPos = vec3.create();
            var endPosDir = vec3.create();
            vec3.scale(endPosDir, mouseVector, 100);
            vec3.add(endPos, cameraPosition, endPosDir);
            this.sceneGraph.currentScene.drawDebugLine(cameraPosition, endPos);
        }
    }

    testRayOBBIntersection(point:Float32Array, vector:Float32Array, box:Mesh.BoundingCube) {
        var values = ["x", "y", "z"]
        var tmin = 0;
        var tmax = 10000000;

        for (var i:number = 0; i < 3; i++) {
            if (Math.abs(vector[i]) < 0.0001) {
                //parallel
                if (point[i] < box.lowest[i] || point[i] > box.highest[i]) {
                    console.log("Failed on containment check for " + values[i]);
                    return null;
                }
            } else {
                var ood = 1.0 / vector[i];
                var t1 = (box.lowest[i] - point[i]) * ood;
                var t2 = (box.highest[i] - point[i]) * ood;
                if (t1 > t2) {
                    //swap
                    var w = t1;
                    t1 = t2;
                    t2 = w;
                }

                if (t1 > tmin) tmin = t1;
                if (t2 < tmax) tmax = t2;
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
    }

}