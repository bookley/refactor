/**
 * Created by Jamie on 02-Jul-15.
 */

///<reference path="../../lib/gl-matrix.d.ts" />

export class GameObject {
    mesh: any;
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
    }

    setMesh(mesh:any){
        this.mesh = mesh;
    }

    setTexture(texture:any){
        this.texture = texture;
    }

    getBoundingCube(){

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
}