define(["shaders", "mesh"], function(Shader, Mesh){
    function Graphics(canvas){
        this.ctx = canvas.getContext("webgl");
        this.viewportWidth = canvas.width;
        this.viewportHeight = canvas.height;
        if(!this.ctx) alert("Error initializing WebGL context");

        this._shaders = [];
        this._meshes = [];

        this.ctx.clearColor(0.0, 0.0, 0.0, 1.0);
    }

    Graphics.prototype.SetAssets = function(assets){
        this.assets = assets;
    }

    Graphics.prototype.LoadShader = function(vShader, fShader, shaderName){
        var vShader = this.assets.Asset(vShader);
        var fShader = this.assets.Asset(fShader);
        var mainShader = new Shader(this.ctx, vShader, fShader);
        mainShader.LoadAttributes(["aVertexPosition"]);
        mainShader.LoadUniforms(["uMVMatrix", "uPMatrix"]);
        this._shaders[shaderName] = mainShader;
    }

    Graphics.prototype.UseShader = function(shaderName){
        this._shaders[shaderName].Activate();
        this.currentShader = this._shaders[shaderName];
    }

    Graphics.prototype.GetShader = function(shaderName){
        return this._shaders[shaderName];
    }

    Graphics.prototype.CreateCube = function(){
        var mesh = new Mesh(this.ctx);
        mesh.MakeCube();

        this._meshes.push(mesh);
    }

    var pMatrix = mat4.create();
    var mvMatrix = mat4.create();

    Graphics.prototype.Draw = function(){
        this.ctx.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        this.ctx.clear(this.ctx.DEPTH_BUFFER_BIT | this.ctx.COLOR_BUFFER_BIT);

        mat4.perspective(pMatrix, 45, this.viewportWidth / this.viewportHeight, 0.1, 100);
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -5.0]);

        this.currentShader.PassMatrix("uMVMatrix", mvMatrix);
        this.currentShader.PassMatrix("uPMatrix", pMatrix);

        for(var i = 0; i < this._meshes.length; i++){
            this._meshes[i].Draw(this.currentShader);
        }
    }

    return Graphics;
});