///<reference path="../../lib/gl-matrix.d.ts" />

export class Camera {
    perspectiveMatrix:Float32Array;
    matrix:Float32Array;
    position:Float32Array;
    //TODO: Camera needs a focal point and a camera point, needs to be possible to set both

    constructor(width, height, fov, znear, zfar) {
        this.matrix = mat4.create();
        this.position = mat4.create();
        this.perspectiveMatrix = mat4.create();

        var vec = vec3.fromValues(0, -2, -10);
        mat4.translate(this.position, this.position, vec);

        mat4.perspective(this.perspectiveMatrix, fov, width / height, znear, zfar);
    }

    getMatrix(){
        var result = mat4.create();
        mat4.multiply(result,  this.position, this.matrix);
        return result;
    }

    getPerspectiveMatrix():Float32Array {
        return this.perspectiveMatrix;
    }

    setMatrix(matrix:Float32Array){
        this.matrix = matrix;
    }
}