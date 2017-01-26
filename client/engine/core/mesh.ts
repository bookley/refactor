import ObjLoader = require("./filetypes/objloader");
import DebugLine = require("./debugLine");
import {vec3, mat4} from 'gl-matrix';
import Shader = require("./shaders");

export class Mesh {
    ctx:WebGLRenderingContext;
    vertexBuffer:WebGLBuffer;
    colorBuffer:WebGLBuffer;
    indexBuffer:WebGLBuffer;
    normalBuffer:WebGLBuffer;
    texturePositionBuffer:WebGLBuffer;

    normalLines:DebugLine[];
    numIndices:number;
    vertices:number[];
    normals:number[];


    constructor(ctx:WebGLRenderingContext){
        this.ctx = ctx;
        this.vertexBuffer = ctx.createBuffer();
        this.colorBuffer = ctx.createBuffer();
        this.indexBuffer = ctx.createBuffer();
        this.normalBuffer = ctx.createBuffer();
        this.texturePositionBuffer = ctx.createBuffer();

        this.normalLines = [];
    }

    loadVerticesFromFile(file:string){
        var modelData = new ObjLoader().readFile(file);
        this.loadVertices(modelData.vertices, modelData.indices, modelData.colors, modelData.normals, modelData.texCoords);
    }

    loadVertices(vertices:number[], indices:number[], colors:number[], normals:number[], texCoords:number[]){
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, Float32Array.from(vertices).buffer, this.ctx.STATIC_DRAW);
        this.vertices = vertices;

        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.ctx.STATIC_DRAW);

        if(colors != undefined) {
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.colorBuffer);
            this.ctx.bufferData(this.ctx.ARRAY_BUFFER, Float32Array.from(colors), this.ctx.STATIC_DRAW);
        }

        if(normals != undefined) {
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normalBuffer);
            this.ctx.bufferData(this.ctx.ARRAY_BUFFER, Float32Array.from(normals), this.ctx.STATIC_DRAW);
            this.normals = normals;
            this.createNormalLines();
        }

        if(texCoords != undefined) {
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.texturePositionBuffer);
            this.ctx.bufferData(this.ctx.ARRAY_BUFFER, Float32Array.from(texCoords), this.ctx.STATIC_DRAW);
        }

        this.numIndices = indices.length;
    }

    createNormalLines():void{
        for(var i = 0; i < this.vertices.length; i+=3){
            var line = new DebugLine(this.ctx,
                vec3.fromValues(this.vertices[i], this.vertices[i+1], this.vertices[i+2]),
                    vec3.fromValues(this.vertices[i] + this.normals[i], this.vertices[i+1] + this.normals[i+1], this.vertices[i+2] + this.normals[i+2]));
            this.normalLines.push(line);
        }
    }

    drawNormals(shader:any, modelMatrix:mat4):void {
        for(var i = 0; i < this.normalLines.length; i++){
            this.normalLines[i].Draw(shader, modelMatrix);
        }
    }

    bindPositionBuffer(shader:any):void {
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
        this.ctx.vertexAttribPointer(shader.attributes["aVertexPosition"], 3, this.ctx.FLOAT, false, 0, 0);
    }

    bindNormalBuffer(shader:any):void {
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normalBuffer);
        this.ctx.vertexAttribPointer(shader.attributes["aVertexNormal"], 3, this.ctx.FLOAT, false, 0, 0);
    }

    bindTextureCoordinatesBuffer(shader:any):void {
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.texturePositionBuffer);
        this.ctx.vertexAttribPointer(shader.attributes["aTexCoords"], 2, this.ctx.FLOAT, false, 0, 0);
    }

    bindIndexBuffer(shader:any):void {
        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }

    draw(shader:Shader, perspectiveMatrix:mat4, cameraMatrix:mat4, modelMatrix:mat4, lightDirection:vec3): void {
        shader.passMatrix("uMVMatrix", modelMatrix);
        shader.passMatrix("uPMatrix", perspectiveMatrix);
        shader.passVec3("lightDirection", lightDirection);
        shader.passMatrix("uCMatrix", cameraMatrix);

        this.bindPositionBuffer(shader);
        this.bindNormalBuffer(shader);
        this.bindTextureCoordinatesBuffer(shader);
        this.bindIndexBuffer(shader);

        this.ctx.drawElements(this.ctx.TRIANGLES, this.numIndices, this.ctx.UNSIGNED_SHORT, 0);
    }

    getBoundingCube(): BoundingCube{
        var boundingCube = new BoundingCube();
        for(var i = 0; i < this.vertices.length/3; i++) {
            var currentVertex = {
                x: this.vertices[i * 3],
                y: this.vertices[i * 3 + 1],
                z: this.vertices[i * 3 + 2]
            };

            if(currentVertex.x < boundingCube.lowest[0]) boundingCube.lowest[0] = currentVertex.x;
            if(currentVertex.x > boundingCube.highest[0]) boundingCube.highest[0] = currentVertex.x;

            if(currentVertex.y < boundingCube.lowest[1]) boundingCube.lowest[1] = currentVertex.y;
            if(currentVertex.y > boundingCube.highest[1]) boundingCube.highest[1] = currentVertex.y;

            if(currentVertex.z < boundingCube.lowest[2]) boundingCube.lowest[2] = currentVertex.z;
            if(currentVertex.z > boundingCube.highest[2]) boundingCube.highest[2] = currentVertex.z;
        };

        return boundingCube;
    }
}

export class BoundingCube {
    lowest:vec3;
    highest:vec3;

    constructor(){
        this.lowest = vec3.create();
        this.highest = vec3.create();
    }

    transform(matrix:mat4): void {
        vec3.transformMat4(this.lowest, this.lowest, matrix);
        vec3.transformMat4(this.highest, this.highest, matrix);
    }
}