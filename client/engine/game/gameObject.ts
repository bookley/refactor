import {mat4, vec3} from 'gl-matrix';
import {MeshInstance} from "../core/interfaces/meshInstance";
import {Texture} from "../core/texture";
import {Mesh, BoundingCube} from "../core/mesh";

class GameObject implements MeshInstance {

    private mesh: Mesh;
    private texture: Texture;
    private orientation: mat4;
    private visible:boolean = true;

    private _x: number;
    private _y: number;
    private _z:number;

    private scaleX: number;
    private scaleY: number;
    private scaleZ: number;

    constructor(){
        this.orientation = mat4.create();
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;
        this.setPosition(0, 0, 0);
    }

    getBoundingCube() : BoundingCube {
        var boundingCube = this.mesh.getBoundingCube();
        return boundingCube;
    }

    get x(): number { return this._x }
    set x(val: number) { this._x = val; }

    get y(): number { return this._y }
    set y(val: number) { this._y = val; }

    get z(): number { return this._z }
    set z(val: number) { this._z = val; }

    setPosition(x: number, y:number, z:number){
        this._x = x;
        this._y = y;
        this._z = z;
    }

    setScaleSingle(scale:number) {
        this.scaleX = scale;
        this.scaleY = scale;
        this.scaleZ = scale;
    }

    public getMesh(): Mesh {
        return this.mesh;
    }

    public setMesh(mesh: Mesh){
        this.mesh = mesh;
    }

    public getTexture(): Texture {
        return this.texture;
    }

    public setTexture(texture:Texture){
        this.texture = texture;
    }

    public getVisible(): boolean {
        return this.visible;
    }

    public setVisible(visible: boolean): void {
        this.visible = visible;
    }

    public getMatrix(): mat4 {
        var matrix = mat4.create();
        mat4.translate(matrix, matrix, vec3.fromValues(this._x, this._y, this._z));
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