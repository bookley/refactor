/**
 * Created by Jamie on 02-Jul-15.
 */

///<reference path="../../../lib/gl-matrix.d.ts" />
import FileLoader = require("fileLoader");

class ObjLoader implements FileLoader.FileLoader {
    vertices: number[];
    indices: number[];
    colors: number[];
    faceNormals: number[];
    vertexNormals: number[];
    vertexNormalCount: number[];
    texCoords: number[];
    textureIndices: number[];

    constructor(){
        this.vertices = [];
        this.vertexNormals = [];
        this.indices = [];
        this.colors = [];
        this.faceNormals = [];
        this.vertexNormalCount = [];
        this.texCoords = [];
        this.textureIndices = [];
    }

    readObjectLine(line:string) : boolean {
        if(line[0] === 'o'){
            return true;
        }
        return false;
    }

    readVertexLine(line:string) : boolean {
        var self = this;
        if(line[0] === 'v' && line[1] == ' '){
            line.substr(2).split(" ").forEach(function(el){
                self.vertices.push(parseFloat(el));
                self.vertexNormals.push(0);
            });
            return true;
        }
        return false;
    }

    readFaceLine(line:string) : boolean {
        var self = this;
        if(line.length < 1) return false;
        if(line[0] === 'f'){
            var re = /\d+\/\d+/;
            if(line.match(re)){
                this.readComplexFaceLine(line);
            } else {
                this.readSimpleFaceLine(line);
            }

            return true;
        }
        return false;
    }

    readComplexFaceLine(line:string) : void {
        var self = this;
        line.substr(2).split(" ").forEach(function(el){
            var vals = el.split("/");
            self.indices.push(parseInt(vals[0])-1);
            self.textureIndices.push(parseInt(vals[1])-1);
            self.vertexNormalCount.push(0);
            self.colors.push(1); self.colors.push(1); self.colors.push(1);
        });
    }

    readSimpleFaceLine(line:string) : void {
        var self = this;
        line.substr(2).split(" ").forEach(function(el){
            self.indices.push(parseInt(el)-1);
            self.vertexNormalCount.push(0);
            self.colors.push(1); self.colors.push(1); self.colors.push(1);
        });
    }

    readVertexTextureLine(line:string): boolean {
        var self = this;
        if(line[0] === 'v' && line[1] == 't'){
            var vals = line.substr(3).split(" ");
            var num1 = parseFloat(vals[0]);
            var num2 = 1-parseFloat(vals[1]);
            self.texCoords.push(num1, num2);
            return true;
        }
        return false;
    }

    calculateFaceNormals() : void {
        for(var i = 0; i < this.indices.length; i+=3){
            var index1 = this.indices[i];
            var index2 = this.indices[i+1];
            var index3 = this.indices[i+2];

            var vpos1 = index1 * 3;
            var vpos2 = index2 * 3;
            var vpos3 = index3 * 3;


            var vertex1 = vec3.fromValues(this.vertices[vpos1], this.vertices[vpos1+1], this.vertices[vpos1+2]);
            var vertex2 = vec3.fromValues(this.vertices[vpos2], this.vertices[vpos2+1], this.vertices[vpos2+2]);
            var vertex3 = vec3.fromValues(this.vertices[vpos3], this.vertices[vpos3+1], this.vertices[vpos3+2]);


            var U = vec3.create(); var P = vec3.create(); var N = vec3.create();
            vec3.subtract(U, vertex2, vertex1);
            vec3.subtract(P, vertex3, vertex1);
            vec3.cross(N, U, P);
            vec3.normalize(N, N);


            //add to vertex 1
            this.vertexNormals[vpos1] += N[0];
            this.vertexNormals[vpos1 + 1] += N[1];
            this.vertexNormals[vpos1 + 2] += N[2];
            this.vertexNormalCount[index1] += 1;

            //add to vertex 2
            this.vertexNormals[vpos2] += N[0];
            this.vertexNormals[vpos2 + 1] += N[1];
            this.vertexNormals[vpos2 + 2] += N[2];
            this.vertexNormalCount[index2] += 1;

            //add to vertex 3
            this.vertexNormals[vpos3] += N[0];
            this.vertexNormals[vpos3 + 1] += N[1];
            this.vertexNormals[vpos3 + 2] += N[2];
            this.vertexNormalCount[index3] += 1;
        }

        for(var i = 0; i < this.vertices.length; i+=3){
            var vpos = i;

            //this.vertexNormals[vpos] /= this.vertexNormalCount[index];
            //this.vertexNormals[vpos+1] /= this.vertexNormalCount[index];
            //this.vertexNormals[vpos+2] /= this.vertexNormalCount[index];


            var sq1 = this.vertexNormals[vpos] * this.vertexNormals[vpos];
            var sq2 = this.vertexNormals[vpos+1] * this.vertexNormals[vpos+1];
            var sq3 = this.vertexNormals[vpos+2] * this.vertexNormals[vpos+2];


            var magnitude = Math.sqrt(sq1 + sq2 + sq3);
            this.vertexNormals[vpos] /= magnitude;
            this.vertexNormals[vpos+1] /= magnitude;
            this.vertexNormals[vpos+2] /= magnitude;

        }
    }

    duplicateTexturePositions() : void {
        var newVertices = [];
        var newNormals = [];
        var newTexCoords = [];
        var newIndices = [];
        var newColors = [];

        var indexTextureIndices = [];
        for(var i = 0; i < this.indices.length; i++){
            var index = this.indices[i];
            var textureIndex = this.textureIndices[i];
            indexTextureIndices[index] = (indexTextureIndices[index] == undefined)? [] : indexTextureIndices[index];
            indexTextureIndices[index].push(textureIndex);
        }

        for(var i = 0; i < this.indices.length; i++){
            var index = this.indices[i];
            var textureIndices = indexTextureIndices[index];

            var firstTextureIndex = textureIndices[0];

            newVertices.push(this.vertices[index * 3], this.vertices[index * 3 + 1], this.vertices[index * 3 + 2]);
            newNormals.push(this.vertexNormals[index * 3], this.vertexNormals[index * 3 + 1], this.vertexNormals[index * 3 + 2]);
            newTexCoords.push(this.texCoords[firstTextureIndex * 2], this.texCoords[firstTextureIndex * 2 + 1]);
            newColors.push(1.0, 1.0, 1.0);
            newIndices.push(i);
            indexTextureIndices[index].splice(0, 1);
        }

        this.vertices = newVertices;
        this.indices = newIndices;
        this.vertexNormals = newNormals;
        this.colors = newColors;
        this.texCoords = newTexCoords;
    }

    readFile(fileString:string) : FileLoader.FileLoaderResult {
        var lines = fileString.split("\n");
        for(var i = 0; i < lines.length; i++){
            var line = lines[i];
            (this.readVertexLine(line) || this.readFaceLine(line) || this.readVertexTextureLine(line) || this.readObjectLine(line))
        }

        this.calculateFaceNormals();
        this.duplicateTexturePositions();

        var result = {
            vertices: this.vertices,
            indices: this.indices,
            colors: this.colors,
            normals: this.vertexNormals,
            texCoords: this.texCoords
        }
        return result;
    }
}

export = ObjLoader;