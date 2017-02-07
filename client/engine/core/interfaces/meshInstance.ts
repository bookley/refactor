import {Mesh} from "../mesh";
import {Texture} from "../texture";
import {mat4} from "gl-matrix";

export interface MeshInstance {
    getMesh(): Mesh;
    setMesh(mesh:Mesh): void;

    getTexture(): Texture;
    setTexture(texture:Texture): void;

    getMatrix(): mat4;

    getVisible(): boolean;
    setVisible(visible: boolean): void;
}