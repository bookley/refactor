define([], function(){
    function Mesh(ctx){
        this.ctx = ctx;
        this.vertexBuffer = ctx.createBuffer();
        this.indexBuffer = ctx.createBuffer();
        this.position = mat4.create();
    }

    Mesh.prototype.LoadVertices = function(vertices, indices){
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(vertices), this.ctx.STATIC_DRAW);

        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.ctx.STATIC_DRAW);

        this.numVertices = vertices.length / 3;
        this.numIndices = indices.length;
    }

    Mesh.prototype.SetPosition = function(x, y, z){
        mat4.identity(this.position);
        mat4.translate(this.position, this.position, [x, y, z]);
    }

    Mesh.prototype.MakeCube = function(){

        var vertices = [
            // Front face
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ];

        var indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23    // left
        ]

       // var indices = [0,1,2, 2,3,0];



        this.LoadVertices(vertices, indices);
    }

    Mesh.prototype.Draw = function(shader){
        shader.PassMatrix("uMVMatrix", this.position);
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
        this.ctx.vertexAttribPointer(shader.attributes["aVertexPosition"], 3, this.ctx.FLOAT, false, 0, 0);

        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.ctx.drawElements(this.ctx.TRIANGLES, this.numIndices, this.ctx.UNSIGNED_SHORT, 0);

        //this.ctx.drawArrays(this.ctx.TRIANGLES, 0, this.numVertices);
    }

    return Mesh;
})