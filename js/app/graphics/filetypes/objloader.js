define([], function(){
    function ObjLoader(){
        this.vertices = [];
        this.indices = [];
        this.colors = [];
        this.faceNormals = [];
        this.vertexNormals = [];
        this.vertexNormalCount = [];
    }

    ObjLoader.prototype.readObjectLine = function(line){
        if(line[0] === 'o'){
            return true;
        }
        return false;
    }

    ObjLoader.prototype.readVertexLine = function(line){
        var self = this;
        if(line[0] === 'v' && line[1] != 'n'){
            line.substr(2).split(" ").forEach(function(el){
               self.vertices.push(parseFloat(el));
               self.vertexNormals.push(0);
            });

            return true;
        }
        return false;
    }

    ObjLoader.prototype.readFaceLine = function(line){
        var self = this;
        if(line.length < 1) return false;
        if(line[0] === 'f'){
            line.substr(2).split(" ").forEach(function(el){
                var num = parseInt(el)-1;
                self.indices.push(parseInt(el)-1);
                self.vertexNormalCount.push(0);
                self.colors.push(1); self.colors.push(1); self.colors.push(1);
            });

            return true;
        }
        return false;
    }

    ObjLoader.prototype.calculateFaceNormals = function(){
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

            this.faceNormals.push(N[0]);
            this.faceNormals.push(N[1]);
            this.faceNormals.push(N[2]);

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

        for(var i = 0; i < this.indices.length; i++){
            var index = this.indices[i];
            var vpos = index1 * 3;
            this.vertexNormals[vpos] /= this.vertexNormalCount[index];
            this.vertexNormals[vpos+1] /= this.vertexNormalCount[index];
            this.vertexNormals[vpos+2] /= this.vertexNormalCount[index];
        }
    }

    /**
     * Reads a file and returns an object containing the vertices and indices of the object
     * @param file The file to read
     * @return An object containing the vertices and indices to draw
     */
    ObjLoader.prototype.readFile = function(file){
        var lines = file.split("\n");
        for(var i = 0; i < lines.length; i++){
            var line = lines[i];
            (this.readVertexLine(line) || this.readFaceLine(line) || this.readObjectLine(line))
        }

        this.calculateFaceNormals();

        var result = {
            vertices: this.vertices,
            indices: this.indices,
            colors: this.colors,
            normals: this.vertexNormals
        }
        //console.log(result);
        return result;
    }

    return ObjLoader;
});