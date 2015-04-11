define([], function(){
    function Mesh(ctx){
        this.ctx = ctx;
        this.vertexBuffer = ctx.createBuffer();
    }

    Mesh.prototype.LoadVertices = function(vertices){
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(vertices), this.ctx.STATIC_DRAW);
        this.numVertices = vertices.length / 3;
    }

    Mesh.prototype.MakeCube = function(){
        var vertices = [
            1.0,  1.0,  0.0,
            -1.0,  1.0,  0.0,
            1.0, -1.0,  0.0,
            -1.0, -1.0,  0.0
        ];
        this.LoadVertices(vertices);
    }

    Mesh.prototype.Draw = function(shader){
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
        this.ctx.vertexAttribPointer(shader.attributes["aVertexPosition"], 3, this.ctx.FLOAT, false, 0, 0);
        this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, 0, this.numVertices);
    }

    return Mesh;
})