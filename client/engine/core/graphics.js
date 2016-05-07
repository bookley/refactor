define(["require", "exports", "core/assets/assetCollection", "core/tileMapRenderer", "core/context"], function (require, exports, AssetCollection, TileMapRenderer, Context) {
    /**
     * Responsible for initializing and maintaining the main WebGL context
     */
    var Graphics = (function () {
        function Graphics(canvas) {
            this.initGL(canvas);
            this.assetCollection = new AssetCollection(this.ctx);
            this.tileMapRenderer = new TileMapRenderer(this.ctx);
        }
        Graphics.prototype.initGL = function (canvas) {
            this.context = new Context.DefaultContext(canvas);
            this.ctx = canvas.getContext("webgl");
            this.viewportWidth = canvas.width;
            this.viewportHeight = canvas.height;
            if (!this.ctx)
                alert("Error initializing WebGL context");
            this._lightDir = Graphics.DEFAULT_LIGHT_DIRECTION;
            this.context.clearColor(Graphics.DEFAULT_CLEAR_COLOR.r, Graphics.DEFAULT_CLEAR_COLOR.g, Graphics.DEFAULT_CLEAR_COLOR.b, Graphics.DEFAULT_CLEAR_COLOR.a);
            this.context.setDepthTestEnabled(true);
        };
        Graphics.prototype.setBackground = function (r, g, b) {
            this.context.clearColor(r, g, b, 1.0);
        };
        Graphics.prototype.setAssets = function (assetLoader) {
            this.assetCollection.setAssets(assetLoader);
        };
        Graphics.prototype.createShader = function (shaderName, vShaderName, fShaderName, attributes, uniforms) {
            this.assetCollection.createShader(shaderName, vShaderName, fShaderName, attributes, uniforms);
        };
        Graphics.prototype.useShader = function (shaderName) {
            this.currentShader = this.assetCollection.getShader(shaderName);
            this.currentShader.Activate();
        };
        Graphics.prototype.setLightDir = function (vec) {
            this._lightDir = vec;
        };
        /**
         * Draws the entities in the scenegraph
         * @param camera The camera to use when rendering the scene
         * @param scenegraph The scenegraph to interate over
         * @constructor
         */
        Graphics.prototype.draw = function (camera, scenegraph) {
            this.context.setVertexAttribArrayEnabled(3, false);
            /* Mesh position */
            this.currentShader.passMatrix("uPMatrix", camera.getPerspectiveMatrix());
            this.currentShader.passVec3("lightDirection", this._lightDir);
            if (!camera)
                throw new Error("Can't draw if a camera isn't set");
            this.currentShader.passMatrix("uCMatrix", camera.getMatrix());
            this.ctx.enable(this.ctx.DEPTH_TEST);
            for (var i = 0; i < scenegraph.graph.length; i++) {
                var entity = scenegraph.graph[i];
                if (!entity.visible)
                    continue;
                var modelMatrix = entity.getMatrix();
                if (entity.texture != null) {
                    entity.texture.Bind();
                }
                entity.mesh.Draw(this.currentShader, modelMatrix);
            }
        };
        /**
         * Renders the debug information in the given scenegraph, and the normals of the entities in the scenegraph
         * @param camera The camera to use when rendering the scene
         * @param scenegraph The scenegraph to interate over
         */
        Graphics.prototype.debugDraw = function (camera, scenegraph) {
            if (!Graphics.DRAW_DEBUG_INFO)
                return;
            if (!camera)
                throw new Error("Can't draw if a camera isn't set");
            this.currentShader.passMatrix("uPMatrix", camera.getPerspectiveMatrix());
            this.currentShader.passMatrix("uCMatrix", camera.GetMatrix());
            for (var i = 0; i < scenegraph.debugGraph.length; i++) {
                var line = scenegraph.debugGraph[i];
                line.draw(this.currentShader, mat4.create());
            }
            for (var i = 0; i < scenegraph.graph.length; i++) {
                var entity = scenegraph.graph[i];
                var modelMatrix = entity.getMatrix();
                entity.mesh.DrawNormals(this.currentShader, modelMatrix);
            }
        };
        Graphics.prototype.instancedDraw = function (camera) {
            this.ctx.viewport(0, 0, this.viewportWidth, this.viewportHeight);
            this.ctx.clear(this.ctx.DEPTH_BUFFER_BIT | this.ctx.COLOR_BUFFER_BIT);
            /* Mesh position */
            this.currentShader.passMatrix("uPMatrix", camera.getPerspectiveMatrix());
            this.currentShader.passVec3("lightDirection", this._lightDir);
            if (!camera)
                throw new Error("Can't draw if a camera isn't set");
            this.currentShader.passMatrix("uCMatrix", camera.getMatrix());
            this.tileMapRenderer.draw(this.currentShader);
        };
        Graphics.DRAW_DEBUG_INFO = false;
        Graphics.DEFAULT_LIGHT_DIRECTION = [0, -1, 0];
        Graphics.DEFAULT_CLEAR_COLOR = {
            r: 1,
            g: 1,
            b: 1,
            a: 1
        };
        return Graphics;
    })();
    return Graphics;
});
//# sourceMappingURL=graphics.client.map