define([], function(){
    function Shader(ctx, vSource, fSource) {
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

    Shader.prototype.LoadUniforms = function(uniformNames){
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

    Shader.prototype.LoadAttributes = function(attributeNames){
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

    Shader.prototype.Activate = function(){
        this.ctx.useProgram(this.shaderProgram);
    }

    Shader.prototype.Deactivate = function(){
        this.ctx.useProgram(null);
    }

    Shader.prototype.PassMatrix = function(uniformName, matrix){
        this.ctx.uniformMatrix4fv(this.uniforms[uniformName], false, matrix);
    }

    return Shader;
});