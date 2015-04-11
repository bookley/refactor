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
        mainShader.LoadUniforms(["uMVMatrix", "uPMatrix", "uCMatrix"]);
        this._shaders[shaderName] = mainShader;
    }

    Graphics.prototype.UseShader = function(shaderName){
        this._shaders[shaderName].Activate();
        this.currentShader = this._shaders[shaderName];
    }

    Graphics.prototype.GetShader = function(shaderName){
        return this._shaders[shaderName];
    }

    /* Helper for creating a cube */
    Graphics.prototype.CreateCube = function(){
        var mesh = new Mesh(this.ctx);
        mesh.MakeCube();
        this._meshes.push(mesh);
        return mesh;
    }

    /* Perspective matrix */
    var pMatrix = mat4.create();

    /* Move Matrix */
    var mvMatrix = mat4.create();

    Graphics.prototype.Draw = function(camera){
        this.ctx.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        this.ctx.clear(this.ctx.DEPTH_BUFFER_BIT | this.ctx.COLOR_BUFFER_BIT);

        mat4.perspective(pMatrix, 45, this.viewportWidth / this.viewportHeight, 0.1, 100);

        this.currentShader.PassMatrix("uPMatrix", pMatrix);

        if(!camera) throw new Error("Can't draw if a camera isn't set");
       // console.log(camera.GetMatrix());
        var x = camera.GetMatrix();
        this.currentShader.PassMatrix("uCMatrix", camera.GetMatrix());

        for(var i = 0; i < this._meshes.length; i++){
            this._meshes[i].Draw(this.currentShader);
        }
    }

    return Graphics;
});