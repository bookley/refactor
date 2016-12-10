import {vec3, vec4, mat4} from "gl-matrix";

export class Camera {
    perspectiveMatrix:mat4;
    matrix:mat4;
    position:mat4;
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

    setMatrix(matrix:mat4){
        this.matrix = matrix;
    }
}