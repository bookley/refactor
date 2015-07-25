/**
 * Created by Jamie on 25-Jul-15.
 */

import Mesh = require("graphics/mesh");

class MeshInstance {
    ctx:WebGLRenderingContext;
    mesh:Mesh.Mesh;

    constructor(ctx:WebGLRenderingContext){
        this.ctx = ctx;
    }

    setMesh(mesh:Mesh.Mesh){
        this.mesh = mesh;
    }

    setInstanceRepeatData(centers:number[]){
        //todo: load buffers here
    }

    Draw(shader:any, modelMatrix:mat4) {
        //todo: bind mesh's buffers (if not already bound)
        //todo: bind instance buffers
        //todo: draw instanced
    }
}