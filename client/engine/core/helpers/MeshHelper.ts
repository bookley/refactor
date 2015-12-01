/**
 * Created by Jamie on 20-Jul-15.
 */
import Mesh = require("core/mesh");

class MeshHelper {
    ctx:WebGLRenderingContext;

    constructor(ctx:WebGLRenderingContext){
        this.ctx = ctx;
    }

    makeSquare():Mesh.Mesh{
        return this.makeSquareFromPosition([0, 0, 0], 1);
    }

    makeSquareFromPosition(position:number[], size:number):Mesh.Mesh {
        var left = position[0];
        var bottom = position[2];

        var right = position[0] + size;
        var top = position[2] + size;

        var y = position[1];

        var vertices = [
            // Front face
            left, y,  bottom, //bottom left
            right, y,  bottom, //bottom right
            right,  y,  top, //top right
            left,  y,  top]; //top left

        var indices = [0, 1, 2, 0, 2, 3];

        var normals = [
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
        ];

        var texCoords = [
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0,
            0.0, 0.0,
        ];

        var mesh = new Mesh.Mesh(this.ctx);
        mesh.LoadVertices(vertices, indices, null, normals, texCoords);
        return mesh;
    }

    CreateMeshFromAsset(asset) {
        var mesh = new Mesh.Mesh(this.ctx);
        mesh.LoadVerticesFromFile(asset.data);
        return mesh;
    }
}

export = MeshHelper;