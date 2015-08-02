///<reference path="../../lib/gl-matrix.d.ts" />

export class Camera {
    matrix:Float32Array;
    position:Float32Array;

    constructor() {
        this.matrix = mat4.create();

        this.position = mat4.create();
        var vec = vec3.fromValues(0, 0, -10);
        mat4.translate(this.position, this.position, vec);
    }

    GetMatrix(){
        //return this.matrix;
        var result = mat4.create();
        return mat4.multiply(result,  this.position, this.matrix);
        return result;
    }
}