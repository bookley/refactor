/**
 * Created by Jamie on 20-Jul-15.
 */
import Mesh = require("graphics/mesh");

export class MeshHelper {
    ctx:WebGLRenderingContext;

    constructor(ctx:WebGLRenderingContext){
        this.ctx = ctx;
    }

    makeSquare():Mesh.Mesh {
        var vertices = [
            // Front face
            -1.0, -1.0,  0.0, //bottom left
            1.0, -1.0,  0.0, //bottom right
            1.0,  1.0,  0.0, //top right
            -1.0,  1.0,  0.0]; //top left

        var indices = [0, 1, 2, 0, 2, 3];

        var colors = [
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
        ];

        var normals = [
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
        ];

        var texCoords = [
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0,
            0.0, 0.0,
        ];

        var mesh = new Mesh.Mesh(this.ctx);
        mesh.LoadVertices(vertices, indices, colors, normals, texCoords);
        return mesh;
    }

    CreateSquare() {
        var mesh = new Mesh.Mesh(this.ctx);
        mesh.MakeSquare();
        return mesh;
    }

    CreateMeshFromAsset(asset) {
        var mesh = new Mesh.Mesh(this.ctx);
        mesh.LoadVerticesFromFile(asset.data);
        return mesh;
    }
}