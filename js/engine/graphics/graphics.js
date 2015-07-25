define(["require", "exports", "graphics/assets/assetCollection"], function (require, exports, AssetCollection) {
    /**
     * Responsible for initializing and maintaining the main WebGL context
     */
    var Graphics = (function () {
        function Graphics(canvas) {
            this.initGL(canvas);
            this.assetCollection = new AssetCollection(this.ctx);
        }
        Graphics.prototype.initGL = function (canvas) {
            this.ctx = canvas.getContext("webgl");
            this.viewportWidth = canvas.width;
            this.viewportHeight = canvas.height;
            if (!this.ctx)
                alert("Error initializing WebGL context");
            this._lightDir = Graphics.DEFAULT_LIGHT_DIRECTION;
            this.ctx.clearColor(Graphics.DEFAULT_CLEAR_COLOR.r, Graphics.DEFAULT_CLEAR_COLOR.g, Graphics.DEFAULT_CLEAR_COLOR.b, Graphics.DEFAULT_CLEAR_COLOR.a);
            this.ctx.enable(this.ctx.DEPTH_TEST);
            this.pMatrix = mat4.create();
            mat4.perspective(this.pMatrix, 45, this.viewportWidth / this.viewportHeight, 1, 100);
        };
        Graphics.prototype.setBackground = function (r, g, b) {
            this.ctx.clearColor(r, g, b, 1.0);
        };
        Graphics.prototype.SetAssets = function (assetLoader) {
            this.assetCollection.setAssets(assetLoader);
        };
        Graphics.prototype.createShader = function (shaderName, vShaderName, fShaderName, attributes, uniforms) {
            this.assetCollection.createShader(shaderName, vShaderName, fShaderName, attributes, uniforms);
        };
        Graphics.prototype.UseShader = function (shaderName) {
            this.currentShader = this.assetCollection.getShader(shaderName);
            this.currentShader.Activate();
        };
        Graphics.prototype.SetLightDir = function (vec) {
            this._lightDir = vec;
        };
        /**
         * Draws the entities in the scenegraph
         * @param camera The camera to use when rendering the scene
         * @param scenegraph The scenegraph to interate over
         * @constructor
         */
        Graphics.prototype.Draw = function (camera, scenegraph) {
            this.ctx.viewport(0, 0, this.viewportWidth, this.viewportHeight);
            this.ctx.clear(this.ctx.DEPTH_BUFFER_BIT | this.ctx.COLOR_BUFFER_BIT);
            /* Mesh position */
            this.currentShader.PassMatrix("uPMatrix", this.pMatrix);
            this.currentShader.PassVec3("lightDirection", this._lightDir);
            if (!camera)
                throw new Error("Can't draw if a camera isn't set");
            this.currentShader.PassMatrix("uCMatrix", camera.GetMatrix());
            for (var i = 0; i < scenegraph.graph.length; i++) {
                var entity = scenegraph.graph[i];
                var modelMatrix = entity.getMatrix();
                if (entity.texture != null) {
                    entity.texture.Bind();
                    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, entity.mesh.texturePositionBuffer);
                    this.ctx.vertexAttribPointer(this.currentShader.attributes["aTexCoords"], 2, this.ctx.FLOAT, false, 0, 0);
                }
                entity.mesh.Draw(this.currentShader, modelMatrix);
            }
        };
        /**
         * Renders the debug information in the given scenegraph, and the normals of the entities in the scenegraph
         * @param camera The camera to use when rendering the scene
         * @param scenegraph The scenegraph to interate over
         */
        Graphics.prototype.DebugDraw = function (camera, scenegraph) {
            if (!Graphics.DRAW_DEBUG_INFO)
                return;
            this.currentShader.PassMatrix("uPMatrix", this.pMatrix);
            if (!camera)
                throw new Error("Can't draw if a camera isn't set");
            this.currentShader.PassMatrix("uCMatrix", camera.GetMatrix());
            for (var i = 0; i < scenegraph.debugGraph.length; i++) {
                var line = scenegraph.debugGraph[i];
                line.Draw(this.currentShader, mat4.create());
            }
            for (var i = 0; i < scenegraph.graph.length; i++) {
                var entity = scenegraph.graph[i];
                var modelMatrix = entity.getMatrix();
                entity.mesh.DrawNormals(this.currentShader, modelMatrix);
            }
        };
        Graphics.prototype.InstancedDraw = function (camera) {
            this.ctx.viewport(0, 0, this.viewportWidth, this.viewportHeight);
            this.ctx.clear(this.ctx.DEPTH_BUFFER_BIT | this.ctx.COLOR_BUFFER_BIT);
            /* Mesh position */
            this.currentShader.PassMatrix("uPMatrix", this.pMatrix);
            this.currentShader.PassVec3("lightDirection", this._lightDir);
            if (!camera)
                throw new Error("Can't draw if a camera isn't set");
            this.currentShader.PassMatrix("uCMatrix", camera.GetMatrix());
        };
        Graphics.DRAW_DEBUG_INFO = false;
        Graphics.DEFAULT_LIGHT_DIRECTION = [0, 0, 1];
        Graphics.DEFAULT_CLEAR_COLOR = {
            r: 0,
            g: 0,
            b: 0,
            a: 1
        };
        return Graphics;
    })();
    return Graphics;
});
//# sourceMappingURL=graphics.js.map