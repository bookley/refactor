import {vec3, mat4} from "gl-matrix";

export abstract class Camera {
    private _viewMatrix: mat4;
    private _projectionMatrix: mat4;

    private _width: number;
    private _height: number;

    constructor() {
        this._viewMatrix = mat4.create();
    }

    get viewMatrix(){
        return mat4.clone(this._viewMatrix);
    }

    set viewMatrix(viewMatrix: mat4){
        this._viewMatrix = viewMatrix;
    }

    get projectionMatrix(): mat4 {
        return mat4.clone(this._projectionMatrix);
    }

    get finalMatrix(): mat4 {
        let final: mat4;
        return mat4.mul(final, this._viewMatrix, this._projectionMatrix);
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    public setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): void {
        this._projectionMatrix = mat4.create();
        mat4.ortho(this._projectionMatrix, left, right, bottom, top, near, far)
    }

    public setPerspective(fovy: number, width: number, height: number, near: number, far: number): void {
        this._width = width;
        this._height = height;

        this._projectionMatrix = mat4.create();
        this._projectionMatrix = mat4.perspective(this._projectionMatrix, fovy, width / height, near, far)
    }
}

export class TargetCamera extends Camera {
    private _position: vec3;
    private _target: vec3;

    constructor(position: vec3, target: vec3){
        super();
        this._position = position;
        this._target = target;
        this.recalculate();
    }

    get position(): vec3 {
        return vec3.clone(this._position);
    }

    set position(position:vec3){
        this._position = position;
        this.recalculate();
    }

    get target(): vec3 {
        return vec3.clone(this._target);
    }

    set target(target: vec3){
        this._target = target;
        this.recalculate();
    }

    private recalculate(): void {
        let matrix = mat4.create(), positionToTarget = vec3.create(), up = vec3.create();
        vec3.sub(positionToTarget, this._target, this._position);
        vec3.cross(up, positionToTarget, vec3.fromValues(1, 0, 0));
        mat4.lookAt(matrix, this._position, this._target, up);
        this.viewMatrix = matrix;
    }
}

export class ArcballCamera extends Camera {

    private _centre: vec3;
    private _radius: number;
    private _alpha: number;
    private _beta: number;


    constructor(centre: vec3, radius: number, alpha: number, beta: number){
        super();
        this._centre = centre;
        this._radius = radius;
        this._alpha = alpha;
        this._beta = beta;
        this.recalculate();
    }

    get centre(): vec3 {
        return vec3.clone(this._centre);
    }

    set centre(value: vec3) {
        this._centre = value;
        this.recalculate();
    }

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
        this.recalculate();
    }

    get alpha(): number {
        return this._alpha;
    }

    set alpha(value: number) {
        this._alpha = value;
        if(this._alpha >= Math.PI * 2) this._alpha = 0;
        if(this._alpha < 0) this._alpha = Math.PI * 2;
        this.recalculate();
    }

    get beta(): number {
        return this._beta;
    }

    set beta(value: number) {
        this._beta = value;
        if(this._beta >= Math.PI * 2) this._beta = 0;
        if(this._beta < 0) this._beta = Math.PI * 2;
        this.recalculate();
    }

    setValues(centre: vec3, radius: number, alpha: number, beta: number){
        this._centre = centre;
        this._radius = radius;
        this._alpha = alpha;
        this._beta = beta;
        this.recalculate();
    }

    private recalculate(): void {
        let matrix = mat4.create();
        mat4.translate(matrix, matrix, vec3.fromValues(0, 0, -this._radius));
        mat4.rotate(matrix, matrix, this._beta, vec3.fromValues(1, 0, 0));
        mat4.rotate(matrix, matrix, this._alpha, vec3.fromValues(0, 1, 0));
        mat4.translate(matrix, matrix, this._centre);
        this.viewMatrix = matrix;
    }
}