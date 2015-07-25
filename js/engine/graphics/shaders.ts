
class Shader {
    ctx:WebGLRenderingContext;
    vSource:string;
    fSource:string;

    uniforms:string[];
    attributes:string[];

    shaderProgram:WebGLProgram;

    constructor(ctx:WebGLRenderingContext, vSource:string, fSource:string){
        this.vSource = vSource;
        this.fSource = fSource;
        this.ctx = ctx;

        this.uniforms = [];
        this.attributes = [];

        var vShader = ctx.createShader(ctx.VERTEX_SHADER);
        var fShader = ctx.createShader(ctx.FRAGMENT_SHADER);

        ctx.shaderSource(vShader, vSource);
        ctx.shaderSource(fShader, fSource);

        ctx.compileShader(vShader);
        ctx.compileShader(fShader);

        this.shaderProgram = ctx.createProgram();

        ctx.attachShader(this.shaderProgram, vShader);
        ctx.attachShader(this.shaderProgram, fShader);
        ctx.linkProgram(this.shaderProgram);
    }

    LoadUniforms(uniformNames:string[]){
        this.Activate();

        for(var i = 0; i < uniformNames.length; i++) {
            var unifName = uniformNames[i];
            var unifLoc = this.ctx.getUniformLocation(this.shaderProgram, unifName);

            if(unifLoc == null){
                throw new Error("Error loading uniform " + unifName);
            }
            this.uniforms[unifName] = unifLoc;
        }
    }

    LoadAttributes(attributeNames:string[]){
        this.Activate();

        for(var i = 0; i < attributeNames.length; i++) {
            var attribName = attributeNames[i];
            var attribLoc = this.ctx.getAttribLocation(this.shaderProgram, attribName);
            if(attribLoc == -1){
                throw new Error("Error loading attribute " + attribName);
            }
            this.ctx.enableVertexAttribArray(attribLoc);
            this.attributes[attribName] = attribLoc;
        }
    }

    Activate() : void {
        this.ctx.useProgram(this.shaderProgram);
    }

    Deactivate() : void {
        this.ctx.useProgram(null);
    }

    PassMatrix(uniformName, matrix) : void{
        this.ctx.uniformMatrix4fv(this.uniforms[uniformName], false, matrix);
    }

    PassVec3(uniformName, vector) : void {
        this.ctx.uniform3f(this.uniforms[uniformName], vector[0], vector[1], vector[2]);
    }
}

export = Shader;