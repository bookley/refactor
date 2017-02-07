
class Shader {
    ctx:WebGLRenderingContext;
    vSource:string;
    fSource:string;

    uniforms:WebGLUniformLocation[];
    attributes:WebGLUniformLocation[];

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

    public loadUniforms(uniformNames:string[]): void {
        this.activate();

        for(var i = 0; i < uniformNames.length; i++) {
            var unifName = uniformNames[i];
            let unifLoc = this.ctx.getUniformLocation(this.shaderProgram, unifName);

            if(unifLoc == null){
                throw new Error("Error loading uniform " + unifName);
            }
            this.uniforms[unifName] = unifLoc;
        }
    }

    public loadAttributes(attributeNames:string[]): void {
        this.activate();

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

    public activate(): void {
        this.ctx.useProgram(this.shaderProgram);
    }

    public deactivate(): void {
        this.ctx.useProgram(null);

        this.attributes.forEach(function(element){
            this.ctx.disableVertexAttribArray(element);
        });

    }

    public passMatrix(uniformName, matrix) : void{
        this.ctx.uniformMatrix4fv(this.uniforms[uniformName], false, matrix);
    }

    public passVec3(uniformName, vector) : void {
        this.ctx.uniform3f(this.uniforms[uniformName], vector[0], vector[1], vector[2]);
    }

    public pass1I(uniformName: string, value:number){
        this.ctx.uniform1i(this.uniforms[uniformName], value);
    }
}

export = Shader;