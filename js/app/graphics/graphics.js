define(["graphics/shaders", "graphics/mesh", "graphics/material"], function(Shader, Mesh, Material){
    function Graphics(canvas){
        this.ctx = canvas.getContext("webgl");
        this.viewportWidth = canvas.width;
        this.viewportHeight = canvas.height;
        if(!this.ctx) alert("Error initializing WebGL context");

        this._shaders = [];
        this._meshes = [];
        this.meshes = [];

        this._lightDir = [0.0, 1.0, 0.0];

        this.ctx.clearColor(0.0, 0.2, 0.0, 1.0);
        this.ctx.enable(this.ctx.DEPTH_TEST);
    }

    Graphics.prototype.setBackground = function(r, g, b){
        this.ctx.clearColor(r, g, b, 1.0);
    }

    Graphics.prototype.SetAssets = function(assets){
        this.assets = assets;
        this._meshes = assets.GetByType("mesh");
        for(var i = 0; i < this._meshes.length; i++){
            var meshAsset = this._meshes[i];
            console.log("adding mesh " + meshAsset.name);
            this.meshes[meshAsset.name] = (this.CreateMeshFromAsset(meshAsset));
        }
    }

    Graphics.prototype.GetMesh = function(meshName){
        var mesh = this.meshes[meshName];
            if(mesh == null) throw new Error("Attempted to access mesh '" + meshName + "', but this mesh could not be found");
        return mesh;
    }

    Graphics.prototype.LoadShader = function(vShader, fShader, shaderName){
        var vShader = this.assets.Asset(vShader);
        var fShader = this.assets.Asset(fShader);
        var mainShader = new Shader(this.ctx, vShader.data, fShader.data);
        mainShader.LoadAttributes(["aVertexPosition", "aVertexColour", "aVertexNormal"]);
        mainShader.LoadUniforms(["uMVMatrix", "uPMatrix", "uCMatrix", "modelMatrix", "lightDirection"]);
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

    Graphics.prototype.CreateMeshFromAsset = function(asset){
        var mesh = new Mesh(this.ctx);
        mesh.LoadVerticesFromFile(asset.data);
        return mesh;
    }

    /* Helper for creating a texture */
    Graphics.prototype.CreateTexture = function(){
        var material = new Material(this.ctx);
    }

    Graphics.prototype.SetLightDir = function(vec){
        this._lightDir = vec;
    }

    /* Perspective matrix */
    var pMatrix = mat4.create();

    /* Move Matrix */
    var mvMatrix = mat4.create();

    Graphics.prototype.Draw = function(camera, scenegraph){
        this.ctx.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        this.ctx.clear(this.ctx.DEPTH_BUFFER_BIT | this.ctx.COLOR_BUFFER_BIT);
        mat4.perspective(pMatrix, 45, this.viewportWidth / this.viewportHeight, 0.1, 100);

        /* Mesh position */
        this.currentShader.PassMatrix("uPMatrix", pMatrix);
        this.currentShader.PassVec3("lightDirection", this._lightDir);

        if(!camera) throw new Error("Can't draw if a camera isn't set");
       // console.log(camera.GetMatrix());
        var x = camera.GetMatrix();
        this.currentShader.PassMatrix("uCMatrix", camera.GetMatrix());

        for(var i = 0; i < scenegraph.graph.length; i++){
            var entity = scenegraph.graph[i];
            entity.mesh.SetPosition(entity.x, entity.y, entity.z);

            /* Mesh scale and orientation */
            var scale = mat4.create();
            mat4.scale(scale, scale, vec3.fromValues(entity.scale.x, entity.scale.y, entity.scale.z));
            this.currentShader.PassMatrix("modelMatrix", scale);

            entity.mesh.Draw(this.currentShader);
        }
    }

    return Graphics;
});