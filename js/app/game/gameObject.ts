/**
 * Created by Jamie on 02-Jul-15.
 */

///<reference path="../../lib/gl-matrix.d.ts" />
import Mesh = require("graphics/mesh");

class GameObject {
    mesh: Mesh.Mesh;
    texture: any;
    orientation: Float32Array;

    x: number;
    y: number;
    z:number;

    scaleX: number;
    scaleY: number;
    scaleZ: number;

    constructor(){
        this.orientation = mat4.create();
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;
        this.setPosition(0, 0, 0);
    }

    setMesh(mesh:Mesh.Mesh){
        this.mesh = mesh;
    }

    setTexture(texture:any){
        this.texture = texture;
    }

    getBoundingCube() : Mesh.BoundingCube{
        var boundingCube = this.mesh.getBoundingCube();
        return boundingCube;
    }

    setPosition(x: number, y:number, z:number){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    setScaleSingle(scale:number) {
        this.scaleX = scale;
        this.scaleY = scale;
        this.scaleZ = scale;
    }

    setOrientation(orientation) {
        this.orientation = orientation;
    }

    getMatrix():Float32Array {
        var matrix = mat4.create();

        mat4.translate(matrix, matrix, vec3.fromValues(this.x, this.y, this.z));
        mat4.mul(matrix, matrix, this.orientation);

        var scale = mat4.create();
        mat4.scale(scale, scale, vec3.fromValues(this.scaleX, this.scaleY, this.scaleZ));
        mat4.mul(matrix, matrix, scale);

        return matrix;
    }

    update(delta){

    }
}

export = GameObject;