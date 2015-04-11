define([], function(){
    function Mesh(ctx){
        this.ctx = ctx;
        this.vertexBuffer = ctx.createBuffer();
        this.position = mat4.create();
    }

    Mesh.prototype.LoadVertices = function(vertices){
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(vertices), this.ctx.STATIC_DRAW);
        this.numVertices = vertices.length / 3;
    }

    Mesh.prototype.SetPosition = function(x, y, z){
        mat4.identity(this.position);
        mat4.translate(this.position, this.position, [x, y, z]);
    }

    Mesh.prototype.MakeCube = function(){

        var vertices = [
            1.0,  1.0,  0.0,
            -1.0,  1.0,  0.0,
            1.0, -1.0,  0.0,
            -1.0, -1.0,  0.0
        ];

        /*
        var vertices = [
            1.0,  0.0,  1.0,
            -1.0,  0.0,  1.0,
            1.0, 0.0,  -1.0,
            -1.0, 0.0,  -1.0
        ];
        */

        this.LoadVertices(vertices);
    }

    Mesh.prototype.Draw = function(shader){
        shader.PassMatrix("uMVMatrix", this.position);
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
        this.ctx.vertexAttribPointer(shader.attributes["aVertexPosition"], 3, this.ctx.FLOAT, false, 0, 0);
        this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, 0, this.numVertices);
    }

    return Mesh;
})