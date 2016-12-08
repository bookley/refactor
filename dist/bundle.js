/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Jamie on 03-Apr-15.
	 */
	"use strict";
	var assetUrls = [
	    {
	        url: "assets/shaders/texturedFrag.frag",
	        name: "texturedFrag",
	        type: "shader"
	    },
	    {
	        url: "assets/shaders/texturedVert.vert",
	        name: "texturedVert",
	        type: "shader"
	    },
	    {
	        url: "assets/shaders/instancedVert.vert",
	        name: "instancedVert",
	        type: "shader"
	    },
	    {
	        url: "assets/shaders/debugFrag.frag",
	        name: "debugFrag",
	        type: "shader"
	    },
	    {
	        url: "assets/shaders/debugVert.vert",
	        name: "debugVert",
	        type: "shader"
	    },
	    {
	        url: "assets/models/man.obj",
	        name: "man",
	        type: "mesh"
	    },
	    {
	        url: "assets/textures/mantex.png",
	        name: "mantexture",
	        type: "texture"
	    },
	    {
	        url: "assets/textures/wood.png",
	        name: "exclamation",
	        type: "texture"
	    },
	    {
	        url: "assets/textures/tileMap2.png",
	        name: "tileMap",
	        type: "texture"
	    },
	    {
	        url: "assets/textures/selectTile.png",
	        name: "selectTile",
	        type: "texture"
	    },
	    {
	        url: "assets/text/test.png",
	        name: "test",
	        type: "texture"
	    },
	    {
	        url: "assets/text/test.fnt",
	        name: "test_fnt",
	        type: "fnt"
	    },
	];
	var graphics_1 = __webpack_require__(1);
	var assetLoader_1 = __webpack_require__(11);
	var camera_1 = __webpack_require__(13);
	var input_1 = __webpack_require__(14);
	var scene_1 = __webpack_require__(17);
	var scenegraph_1 = __webpack_require__(24);
	var cameraClickPickerBehaviour_1 = __webpack_require__(25);
	var Engine = (function () {
	    /**
	     *
	     * @param canvas The name of the canvas element to use for the renderer
	     * @param sceneClass
	     */
	    function Engine(canvas, sceneClass) {
	        var self = this;
	        this.ready = false;
	        //Dep 1
	        this.canvas = document.getElementById(canvas);
	        //Dep 2
	        this.camera = new camera_1.Camera(this.canvas.width, this.canvas.height, 45, 1, 100);
	        //Dep 3
	        this.graphics = new graphics_1.Graphics(this.canvas);
	        //Dep 4
	        this.input = new input_1.InputListener(this.canvas);
	        this.input.ControlCamera(this.camera);
	        //Dep 5
	        this.sceneGraph = new scenegraph_1.Scenegraph();
	        //Dep 6
	        this.scene = new sceneClass(this);
	        //Dep 7
	        var pickingBehaviour = new cameraClickPickerBehaviour_1.CameraClickPickerBehaviour(this.sceneGraph, this.camera);
	        pickingBehaviour.setViewportDimensions(this.graphics.viewportWidth, this.graphics.viewportHeight);
	        this.input.setOnCameraClickBehaviour(pickingBehaviour);
	        //Dep 8
	        this.assetLoader = new assetLoader_1.AssetLoader(assetUrls);
	        this.assetLoader.loadAll().then(function () {
	            self.ready = true;
	            self.graphics.setAssets(self.assetLoader);
	            self.loadShaders();
	            engine.input.setMouseMoveListener(self.scene);
	            self.scene.onStart();
	        }).catch(function (err) {
	            console.error(err.stack);
	        });
	    }
	    Engine.prototype.loadShaders = function () {
	        this.graphics.createShader("TexturedShader", "texturedVert", "texturedFrag", ["aVertexPosition", "aVertexNormal", "aTexCoords"], ["uMVMatrix", "uPMatrix", "uCMatrix", "lightDirection"]);
	        this.graphics.createShader("DebugShader", "debugVert", "debugFrag", ["aVertexPosition", "aVertexColour"], ["uMVMatrix", "uPMatrix", "uCMatrix"]);
	        this.graphics.createShader("InstancedShader", "instancedVert", "texturedFrag", ["aVertexPosition", "aVertexNormal", "aTexCoords"], ["uPMatrix", "uCMatrix", "lightDirection"]);
	    };
	    return Engine;
	}());
	var engine = new Engine("mycanvas", scene_1.Scene);
	function loop() {
	    if (engine.ready) {
	        engine.input.Update();
	        engine.sceneGraph.update(0);
	        engine.graphics.useShader("InstancedShader");
	        engine.graphics.instancedDraw(engine.camera);
	        engine.graphics.useShader("TexturedShader");
	        engine.graphics.draw(engine.camera, engine.sceneGraph);
	        engine.graphics.useShader("DebugShader");
	        engine.graphics.debugDraw(engine.camera, engine.sceneGraph);
	    }
	    window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
	module.exports = Engine;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var AssetCollection = __webpack_require__(2);
	var TileMapRenderer = __webpack_require__(9);
	var context_1 = __webpack_require__(10);
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
	        this.context = new context_1.DefaultContext(canvas);
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
	    return Graphics;
	}());
	Graphics.DRAW_DEBUG_INFO = false;
	Graphics.DEFAULT_LIGHT_DIRECTION = [0, -1, 0];
	Graphics.DEFAULT_CLEAR_COLOR = {
	    r: 1,
	    g: 1,
	    b: 1,
	    a: 1
	};
	exports.Graphics = Graphics;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var MeshHelper = __webpack_require__(3);
	var Texture = __webpack_require__(7);
	var Shader = __webpack_require__(8);
	/**
	 * Responsible for turning a collection of resolved remote assets into real assets (Textures/Meshes etc.) and storing them
	 */
	var AssetCollection = (function () {
	    function AssetCollection(ctx) {
	        this.ctx = ctx;
	        this.meshHelper = new MeshHelper(this.ctx);
	        this.meshes = [];
	        this.textures = [];
	        this.shaderFiles = [];
	        this.shaders = [];
	        this.fontsFiles = [];
	    }
	    AssetCollection.prototype.setAssets = function (assetLoader) {
	        var self = this;
	        self.addMesh("square", this.meshHelper.makeSquare());
	        assetLoader.getByType("mesh").forEach(function (meshAsset) {
	            self.addMesh(meshAsset.name, self.meshHelper.CreateMeshFromAsset(meshAsset));
	        });
	        assetLoader.getByType("texture").forEach(function (textureAsset) {
	            self.addTexture(textureAsset.name, new Texture(self.ctx, textureAsset.data));
	        });
	        assetLoader.getByType("shader").forEach(function (shaderAsset) {
	            self.addShaderFile(shaderAsset.name, shaderAsset);
	        });
	        assetLoader.getByType("fnt").forEach(function (shaderAsset) {
	            self.addShaderFile(shaderAsset.name, shaderAsset);
	        });
	    };
	    AssetCollection.prototype.addMesh = function (name, mesh) {
	        this.meshes[name] = mesh;
	    };
	    AssetCollection.prototype.addTexture = function (name, texture) {
	        this.textures[name] = texture;
	    };
	    AssetCollection.prototype.addShaderFile = function (name, shaderFile) {
	        this.shaderFiles[name] = shaderFile;
	    };
	    AssetCollection.prototype.addFont = function (name, fontFile) {
	        this.fontsFiles[name] = fontFile;
	    };
	    AssetCollection.prototype.createShader = function (shaderName, vShaderName, fShaderName, attributes, uniforms) {
	        var vShader = this.getShaderFile(vShaderName);
	        var fShader = this.getShaderFile(fShaderName);
	        var mainShader = new Shader(this.ctx, vShader.data, fShader.data);
	        mainShader.LoadAttributes(attributes);
	        mainShader.LoadUniforms(uniforms);
	        this.shaders[shaderName] = mainShader;
	    };
	    AssetCollection.prototype.getMesh = function (meshName) {
	        var mesh = this.meshes[meshName];
	        if (mesh == null)
	            throw new Error("Attempted to access mesh '" + meshName + "', but this mesh could not be found");
	        return mesh;
	    };
	    AssetCollection.prototype.getTexture = function (textureName) {
	        var texture = this.textures[textureName];
	        if (texture == null)
	            throw new Error("Attempted to access texture '" + textureName + "', but this texture could not be found");
	        return texture;
	    };
	    AssetCollection.prototype.getShaderFile = function (shaderFileName) {
	        var shaderFile = this.shaderFiles[shaderFileName];
	        if (shaderFile == null)
	            throw new Error("Attempted to access shaderFile '" + shaderFileName + "', but this shaderFile could not be found");
	        return shaderFile;
	    };
	    AssetCollection.prototype.getShader = function (shaderName) {
	        var shader = this.shaders[shaderName];
	        if (shader == null)
	            throw new Error("Attempted to access shader '" + shaderName + "', but this shader could not be found");
	        return shader;
	    };
	    return AssetCollection;
	}());
	module.exports = AssetCollection;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var mesh_1 = __webpack_require__(4);
	/**
	 * Created by Jamie on 20-Jul-15.
	 */
	var MeshHelper = (function () {
	    function MeshHelper(ctx) {
	        this.ctx = ctx;
	    }
	    MeshHelper.prototype.makeSquare = function () {
	        return this.makeSquareFromPosition([0, 0, 0], 1);
	    };
	    MeshHelper.prototype.makeSquareFromPosition = function (position, size) {
	        var left = position[0];
	        var bottom = position[2];
	        var right = position[0] + size;
	        var top = position[2] + size;
	        var y = position[1];
	        var vertices = [
	            // Front face
	            left, y, bottom,
	            right, y, bottom,
	            right, y, top,
	            left, y, top
	        ]; //top left
	        var indices = [0, 1, 2, 0, 2, 3];
	        var normals = [
	            0.0, 1.0, 0.0,
	            0.0, 1.0, 0.0,
	            0.0, 1.0, 0.0,
	            0.0, 1.0, 0.0,
	        ];
	        var texCoords = [
	            0.0, 1.0,
	            1.0, 1.0,
	            1.0, 0.0,
	            0.0, 0.0,
	        ];
	        var mesh = new mesh_1.Mesh(this.ctx);
	        mesh.LoadVertices(vertices, indices, null, normals, texCoords);
	        return mesh;
	    };
	    MeshHelper.prototype.CreateMeshFromAsset = function (asset) {
	        var mesh = new mesh_1.Mesh(this.ctx);
	        mesh.LoadVerticesFromFile(asset.data);
	        return mesh;
	    };
	    return MeshHelper;
	}());
	module.exports = MeshHelper;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ObjLoader = __webpack_require__(5);
	var DebugLine = __webpack_require__(6);
	/**
	 * Created by Jamie on 02-Jul-15.
	 */
	///<reference path="../../lib/gl-matrix.d.ts" />
	var Mesh = (function () {
	    function Mesh(ctx) {
	        this.ctx = ctx;
	        this.vertexBuffer = ctx.createBuffer();
	        this.colorBuffer = ctx.createBuffer();
	        this.indexBuffer = ctx.createBuffer();
	        this.normalBuffer = ctx.createBuffer();
	        this.texturePositionBuffer = ctx.createBuffer();
	        this.normalLines = [];
	    }
	    Mesh.prototype.LoadVerticesFromFile = function (file) {
	        var modelData = new ObjLoader().readFile(file);
	        this.LoadVertices(modelData.vertices, modelData.indices, modelData.colors, modelData.normals, modelData.texCoords);
	    };
	    Mesh.prototype.LoadVertices = function (vertices, indices, colors, normals, texCoords) {
	        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
	        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(vertices), this.ctx.STATIC_DRAW);
	        this.vertices = vertices;
	        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	        this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.ctx.STATIC_DRAW);
	        if (colors != undefined) {
	            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.colorBuffer);
	            this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(colors), this.ctx.STATIC_DRAW);
	        }
	        if (normals != undefined) {
	            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normalBuffer);
	            this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(normals), this.ctx.STATIC_DRAW);
	            this.normals = normals;
	            this.createNormalLines();
	        }
	        if (texCoords != undefined) {
	            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.texturePositionBuffer);
	            this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(texCoords), this.ctx.STATIC_DRAW);
	        }
	        this.numIndices = indices.length;
	    };
	    Mesh.prototype.createNormalLines = function () {
	        for (var i = 0; i < this.vertices.length; i += 3) {
	            var line = new DebugLine(this.ctx, vec3.fromValues(this.vertices[i], this.vertices[i + 1], this.vertices[i + 2]), vec3.fromValues(this.vertices[i] + this.normals[i], this.vertices[i + 1] + this.normals[i + 1], this.vertices[i + 2] + this.normals[i + 2]));
	            this.normalLines.push(line);
	        }
	    };
	    Mesh.prototype.DrawNormals = function (shader, modelMatrix) {
	        for (var i = 0; i < this.normalLines.length; i++) {
	            this.normalLines[i].Draw(shader, modelMatrix);
	        }
	    };
	    Mesh.prototype.bindPositionBuffer = function (shader) {
	        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
	        this.ctx.vertexAttribPointer(shader.attributes["aVertexPosition"], 3, this.ctx.FLOAT, false, 0, 0);
	    };
	    Mesh.prototype.bindNormalBuffer = function (shader) {
	        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normalBuffer);
	        this.ctx.vertexAttribPointer(shader.attributes["aVertexNormal"], 3, this.ctx.FLOAT, false, 0, 0);
	    };
	    Mesh.prototype.bindTextureCoordinatesBuffer = function (shader) {
	        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.texturePositionBuffer);
	        this.ctx.vertexAttribPointer(shader.attributes["aTexCoords"], 2, this.ctx.FLOAT, false, 0, 0);
	    };
	    Mesh.prototype.bindIndexBuffer = function (shader) {
	        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	    };
	    Mesh.prototype.bindBuffers = function (shader, modelMatrix) {
	        this.bindPositionBuffer(shader);
	        this.bindNormalBuffer(shader);
	        this.bindTextureCoordinatesBuffer(shader);
	        this.bindIndexBuffer(shader);
	    };
	    Mesh.prototype.Draw = function (shader, modelMatrix) {
	        //Need to have texture//colours bound at this point
	        //if this.material -> this.material.bind
	        //add something to notify if shader.attributes["name"] doesn't exist
	        //console.log("drawing");
	        this.bindBuffers(shader, modelMatrix);
	        shader.passMatrix("uMVMatrix", modelMatrix);
	        this.ctx.drawElements(this.ctx.TRIANGLES, this.numIndices, this.ctx.UNSIGNED_SHORT, 0);
	    };
	    Mesh.prototype.getBoundingCube = function () {
	        var boundingCube = new BoundingCube();
	        //console.log(this.vertices);
	        for (var i = 0; i < this.vertices.length / 3; i++) {
	            var currentVertex = {
	                x: this.vertices[i * 3],
	                y: this.vertices[i * 3 + 1],
	                z: this.vertices[i * 3 + 2]
	            };
	            if (currentVertex.x < boundingCube.lowest[0])
	                boundingCube.lowest[0] = currentVertex.x;
	            if (currentVertex.x > boundingCube.highest[0])
	                boundingCube.highest[0] = currentVertex.x;
	            if (currentVertex.y < boundingCube.lowest[1])
	                boundingCube.lowest[1] = currentVertex.y;
	            if (currentVertex.y > boundingCube.highest[1])
	                boundingCube.highest[1] = currentVertex.y;
	            if (currentVertex.z < boundingCube.lowest[2])
	                boundingCube.lowest[2] = currentVertex.z;
	            if (currentVertex.z > boundingCube.highest[2])
	                boundingCube.highest[2] = currentVertex.z;
	        }
	        ;
	        return boundingCube;
	    };
	    return Mesh;
	}());
	exports.Mesh = Mesh;
	var BoundingCube = (function () {
	    function BoundingCube() {
	        this.lowest = vec3.create();
	        this.highest = vec3.create();
	    }
	    BoundingCube.prototype.transform = function (matrix) {
	        vec3.transformMat4(this.lowest, this.lowest, matrix);
	        vec3.transformMat4(this.highest, this.highest, matrix);
	    };
	    return BoundingCube;
	}());
	exports.BoundingCube = BoundingCube;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Created by Jamie on 02-Jul-15.
	 */
	///<reference path="../../../lib/gl-matrix.d.ts" />
	var ObjLoader = (function () {
	    function ObjLoader() {
	        this.vertices = [];
	        this.vertexNormals = [];
	        this.indices = [];
	        this.colors = [];
	        this.faceNormals = [];
	        this.vertexNormalCount = [];
	        this.texCoords = [];
	        this.textureIndices = [];
	    }
	    ObjLoader.prototype.readObjectLine = function (line) {
	        if (line[0] === 'o') {
	            return true;
	        }
	        return false;
	    };
	    ObjLoader.prototype.readVertexLine = function (line) {
	        var self = this;
	        if (line[0] === 'v' && line[1] == ' ') {
	            line.substr(2).split(" ").forEach(function (el) {
	                self.vertices.push(parseFloat(el));
	                self.vertexNormals.push(0);
	            });
	            return true;
	        }
	        return false;
	    };
	    ObjLoader.prototype.readFaceLine = function (line) {
	        var self = this;
	        if (line.length < 1)
	            return false;
	        if (line[0] === 'f') {
	            var re = /\d+\/\d+/;
	            if (line.match(re)) {
	                this.readComplexFaceLine(line);
	            }
	            else {
	                this.readSimpleFaceLine(line);
	            }
	            return true;
	        }
	        return false;
	    };
	    ObjLoader.prototype.readComplexFaceLine = function (line) {
	        var self = this;
	        line.substr(2).split(" ").forEach(function (el) {
	            var vals = el.split("/");
	            self.indices.push(parseInt(vals[0]) - 1);
	            self.textureIndices.push(parseInt(vals[1]) - 1);
	            self.vertexNormalCount.push(0);
	            self.colors.push(1);
	            self.colors.push(1);
	            self.colors.push(1);
	        });
	    };
	    ObjLoader.prototype.readSimpleFaceLine = function (line) {
	        var self = this;
	        line.substr(2).split(" ").forEach(function (el) {
	            self.indices.push(parseInt(el) - 1);
	            self.vertexNormalCount.push(0);
	            self.colors.push(1);
	            self.colors.push(1);
	            self.colors.push(1);
	        });
	    };
	    ObjLoader.prototype.readVertexTextureLine = function (line) {
	        var self = this;
	        if (line[0] === 'v' && line[1] == 't') {
	            var vals = line.substr(3).split(" ");
	            var num1 = parseFloat(vals[0]);
	            var num2 = 1 - parseFloat(vals[1]);
	            self.texCoords.push(num1, num2);
	            return true;
	        }
	        return false;
	    };
	    ObjLoader.prototype.calculateFaceNormals = function () {
	        for (var i = 0; i < this.indices.length; i += 3) {
	            var index1 = this.indices[i];
	            var index2 = this.indices[i + 1];
	            var index3 = this.indices[i + 2];
	            var vpos1 = index1 * 3;
	            var vpos2 = index2 * 3;
	            var vpos3 = index3 * 3;
	            var vertex1 = vec3.fromValues(this.vertices[vpos1], this.vertices[vpos1 + 1], this.vertices[vpos1 + 2]);
	            var vertex2 = vec3.fromValues(this.vertices[vpos2], this.vertices[vpos2 + 1], this.vertices[vpos2 + 2]);
	            var vertex3 = vec3.fromValues(this.vertices[vpos3], this.vertices[vpos3 + 1], this.vertices[vpos3 + 2]);
	            var U = vec3.create();
	            var P = vec3.create();
	            var N = vec3.create();
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
	        for (var i = 0; i < this.vertices.length; i += 3) {
	            var vpos = i;
	            //this.vertexNormals[vpos] /= this.vertexNormalCount[index];
	            //this.vertexNormals[vpos+1] /= this.vertexNormalCount[index];
	            //this.vertexNormals[vpos+2] /= this.vertexNormalCount[index];
	            var sq1 = this.vertexNormals[vpos] * this.vertexNormals[vpos];
	            var sq2 = this.vertexNormals[vpos + 1] * this.vertexNormals[vpos + 1];
	            var sq3 = this.vertexNormals[vpos + 2] * this.vertexNormals[vpos + 2];
	            var magnitude = Math.sqrt(sq1 + sq2 + sq3);
	            this.vertexNormals[vpos] /= magnitude;
	            this.vertexNormals[vpos + 1] /= magnitude;
	            this.vertexNormals[vpos + 2] /= magnitude;
	        }
	    };
	    ObjLoader.prototype.duplicateTexturePositions = function () {
	        var newVertices = [];
	        var newNormals = [];
	        var newTexCoords = [];
	        var newIndices = [];
	        var newColors = [];
	        var indexTextureIndices = [];
	        for (var i = 0; i < this.indices.length; i++) {
	            var index = this.indices[i];
	            var textureIndex = this.textureIndices[i];
	            indexTextureIndices[index] = (indexTextureIndices[index] == undefined) ? [] : indexTextureIndices[index];
	            indexTextureIndices[index].push(textureIndex);
	        }
	        for (var i = 0; i < this.indices.length; i++) {
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
	    };
	    ObjLoader.prototype.readFile = function (fileString) {
	        var lines = fileString.split("\n");
	        for (var i = 0; i < lines.length; i++) {
	            var line = lines[i];
	            (this.readVertexLine(line) || this.readFaceLine(line) || this.readVertexTextureLine(line) || this.readObjectLine(line));
	        }
	        this.calculateFaceNormals();
	        this.duplicateTexturePositions();
	        var result = {
	            vertices: this.vertices,
	            indices: this.indices,
	            colors: this.colors,
	            normals: this.vertexNormals,
	            texCoords: this.texCoords
	        };
	        return result;
	    };
	    return ObjLoader;
	}());
	module.exports = ObjLoader;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	var DebugLine = (function () {
	    function DebugLine(ctx, pos1, pos2) {
	        this.ctx = ctx;
	        var vertices = [pos1[0], pos1[1], pos1[2], pos2[0], pos2[1], pos2[2]];
	        var indices = [0, 1];
	        //green to blue
	        var colors = [0, 1, 0, 0, 0, 1];
	        this.vertexBuffer = ctx.createBuffer();
	        this.colorBuffer = ctx.createBuffer();
	        this.indexBuffer = ctx.createBuffer();
	        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
	        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(vertices), this.ctx.STATIC_DRAW);
	        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	        this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.ctx.STATIC_DRAW);
	        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.colorBuffer);
	        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(colors), this.ctx.STATIC_DRAW);
	    }
	    DebugLine.prototype.Draw = function (shader, modelMatrix) {
	        //Need to have texture//colours bound at this point
	        //if this.material -> this.material.bind
	        //add something to notify if shader.attributes["name"] doesn't exist
	        //console.log("drawing");
	        shader.passMatrix("uMVMatrix", modelMatrix);
	        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
	        this.ctx.vertexAttribPointer(shader.attributes["aVertexPosition"], 3, this.ctx.FLOAT, false, 0, 0);
	        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.colorBuffer);
	        this.ctx.vertexAttribPointer(shader.attributes["aVertexColour"], 3, this.ctx.FLOAT, false, 0, 0);
	        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	        this.ctx.drawElements(this.ctx.LINES, 2, this.ctx.UNSIGNED_SHORT, 0);
	    };
	    return DebugLine;
	}());
	module.exports = DebugLine;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Created by Jamie on 28-Jun-15.
	 */
	var Texture = (function () {
	    function Texture(ctx, img) {
	        if (ctx == null)
	            throw new Error("Ctx cannot be null for texture to load");
	        this.ctx = ctx;
	        this.image = img;
	        this.ctx.enable(this.ctx.BLEND);
	        this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
	        this.id = this.ctx.createTexture();
	        this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.id);
	        this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, this.image);
	        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.LINEAR);
	        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.LINEAR_MIPMAP_LINEAR);
	        this.ctx.generateMipmap(this.ctx.TEXTURE_2D);
	        this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);
	    }
	    Texture.prototype.Bind = function () {
	        this.ctx.enable(this.ctx.BLEND);
	        this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
	        this.ctx.activeTexture(this.ctx.TEXTURE0);
	        this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.id);
	    };
	    return Texture;
	}());
	module.exports = Texture;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	var Shader = (function () {
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
	    Shader.prototype.LoadUniforms = function (uniformNames) {
	        this.Activate();
	        for (var i = 0; i < uniformNames.length; i++) {
	            var unifName = uniformNames[i];
	            var unifLoc = this.ctx.getUniformLocation(this.shaderProgram, unifName);
	            if (unifLoc == null) {
	                throw new Error("Error loading uniform " + unifName);
	            }
	            this.uniforms[unifName] = unifLoc;
	        }
	    };
	    Shader.prototype.LoadAttributes = function (attributeNames) {
	        this.Activate();
	        for (var i = 0; i < attributeNames.length; i++) {
	            var attribName = attributeNames[i];
	            var attribLoc = this.ctx.getAttribLocation(this.shaderProgram, attribName);
	            if (attribLoc == -1) {
	                throw new Error("Error loading attribute " + attribName);
	            }
	            this.ctx.enableVertexAttribArray(attribLoc);
	            this.attributes[attribName] = attribLoc;
	        }
	    };
	    Shader.prototype.Activate = function () {
	        this.ctx.useProgram(this.shaderProgram);
	    };
	    Shader.prototype.Deactivate = function () {
	        this.ctx.useProgram(null);
	        this.attributes.forEach(function (element) {
	            this.ctx.disableVertexAttribArray(element);
	        });
	    };
	    Shader.prototype.passMatrix = function (uniformName, matrix) {
	        this.ctx.uniformMatrix4fv(this.uniforms[uniformName], false, matrix);
	    };
	    Shader.prototype.passVec3 = function (uniformName, vector) {
	        this.ctx.uniform3f(this.uniforms[uniformName], vector[0], vector[1], vector[2]);
	    };
	    return Shader;
	}());
	module.exports = Shader;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Created by Jamie on 26-Jul-15.
	 */
	var TileMapRenderer = (function () {
	    function TileMapRenderer(ctx) {
	        this.ctx = ctx;
	        this.tileIndex = 0;
	        this.vertexBuffer = ctx.createBuffer();
	        this.normalBuffer = ctx.createBuffer();
	        this.indexBuffer = ctx.createBuffer();
	        this.texturePositionBuffer = ctx.createBuffer();
	    }
	    TileMapRenderer.prototype.setTileMap = function (tileMap) {
	        this.tileMap = tileMap;
	        this.calculateDataForTileMap(tileMap);
	        this.updateData();
	    };
	    TileMapRenderer.prototype.updateData = function () {
	        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
	        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.vertices), this.ctx.DYNAMIC_DRAW);
	        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normalBuffer);
	        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.normals), this.ctx.DYNAMIC_DRAW);
	        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.texturePositionBuffer);
	        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.texCoords), this.ctx.DYNAMIC_DRAW);
	        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	        this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.ctx.DYNAMIC_DRAW);
	    };
	    TileMapRenderer.prototype.bindPositionBuffer = function (shader) {
	        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
	        this.ctx.vertexAttribPointer(shader.attributes["aVertexPosition"], 3, this.ctx.FLOAT, false, 0, 0);
	    };
	    TileMapRenderer.prototype.bindNormalBuffer = function (shader) {
	        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normalBuffer);
	        this.ctx.vertexAttribPointer(shader.attributes["aVertexNormal"], 3, this.ctx.FLOAT, false, 0, 0);
	    };
	    TileMapRenderer.prototype.bindTextureCoordinatesBuffer = function (shader) {
	        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.texturePositionBuffer);
	        this.ctx.vertexAttribPointer(shader.attributes["aTexCoords"], 2, this.ctx.FLOAT, false, 0, 0);
	    };
	    TileMapRenderer.prototype.bindIndexBuffer = function (shader) {
	        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	    };
	    TileMapRenderer.prototype.bindBuffers = function (shader) {
	        this.bindPositionBuffer(shader);
	        this.bindNormalBuffer(shader);
	        this.bindTextureCoordinatesBuffer(shader);
	        this.bindIndexBuffer(shader);
	    };
	    TileMapRenderer.prototype.draw = function (shader) {
	        this.tileMap.getImageMap().getTexture().Bind();
	        this.bindBuffers(shader);
	        this.ctx.drawElements(this.ctx.TRIANGLES, this.indices.length, this.ctx.UNSIGNED_SHORT, 0);
	    };
	    TileMapRenderer.prototype.calculateDataForTileMap = function (tileMap) {
	        this.vertices = [];
	        this.indices = [];
	        this.texCoords = [];
	        this.normals = [];
	        this.tileIndex = 0;
	        var tileLevels = tileMap.getTileLevels();
	        var result = [];
	        for (var i = 0; i < tileLevels.length; i++) {
	            var tileLevel = tileLevels[i];
	            this.calculateDataForTileLevel(tileLevel);
	        }
	    };
	    TileMapRenderer.prototype.calculateDataForTileLevel = function (tileLevel) {
	        var tiles = tileLevel.getTiles();
	        var result = [];
	        for (var i = 0; i < tiles.length; i++) {
	            var tile = tiles[i];
	            this.calculateDataForTile(tile);
	        }
	        return result;
	    };
	    TileMapRenderer.prototype.calculateDataForTile = function (tile) {
	        var left = tile.x;
	        var bottom = tile.z;
	        var right = tile.x + this.tileMap.getTileWidth();
	        var top = tile.z + this.tileMap.getTileHeight();
	        var y = tile.y;
	        var vertices = [
	            // Front face
	            left, y, bottom,
	            right, y, bottom,
	            right, y, top,
	            left, y, top
	        ]; //top left
	        var indices = [0 + this.tileIndex, 1 + this.tileIndex, 2 + this.tileIndex, 0 + this.tileIndex, 2 + this.tileIndex, 3 + this.tileIndex];
	        var normals = [
	            0.0, 1.0, 0.0,
	            0.0, 1.0, 0.0,
	            0.0, 1.0, 0.0,
	            0.0, 1.0, 0.0,
	        ];
	        var texCoords = this.tileMap.getImageMap().getCoordsAtIndex(tile.getImageMapIndex());
	        this.tileIndex += 4;
	        Array.prototype.push.apply(this.vertices, vertices);
	        Array.prototype.push.apply(this.indices, indices);
	        Array.prototype.push.apply(this.normals, normals);
	        Array.prototype.push.apply(this.texCoords, texCoords);
	    };
	    return TileMapRenderer;
	}());
	module.exports = TileMapRenderer;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	var DefaultContext = (function () {
	    function DefaultContext(canvas) {
	        this.ctx = canvas.getContext("webgl");
	    }
	    DefaultContext.prototype.clearColor = function (r, g, b, a) {
	        this.ctx.clearColor(r, g, b, a);
	    };
	    DefaultContext.prototype.setDepthTestEnabled = function (value) {
	        if (value)
	            this.ctx.enable(this.ctx.DEPTH_TEST);
	        else
	            this.ctx.disable(this.ctx.DEPTH_TEST);
	    };
	    DefaultContext.prototype.setVertexAttribArrayEnabled = function (arrayIndex, value) {
	        if (value)
	            this.ctx.enableVertexAttribArray(arrayIndex);
	        else
	            this.ctx.disableVertexAttribArray(arrayIndex);
	    };
	    DefaultContext.prototype.getError = function () {
	        return this.ctx.getError();
	    };
	    return DefaultContext;
	}());
	exports.DefaultContext = DefaultContext;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var asset_1 = __webpack_require__(12);
	/**
	 * Responsible for resolving a collection of urls into asset objects
	 */
	var AssetLoader = (function () {
	    function AssetLoader(urls) {
	        this.urls = urls;
	        this.assets = [];
	    }
	    /**
	     *
	     * @param url The url to fire the ajax request to
	     * @returns {Promise} Called when the asset file has been downloaded
	     * @constructor
	     */
	    AssetLoader.prototype.resolveFile = function (url) {
	        var promise = new Promise(function (resolve, reject) {
	            var request = new XMLHttpRequest();
	            request.open("GET", url, true);
	            request.onreadystatechange = function () {
	                if (request.readyState == 0 || request.readyState == 4) {
	                    if (request.status == 200) {
	                        resolve(request.responseText);
	                    }
	                    else {
	                        reject(request.status + " " + request.responseText);
	                    }
	                }
	            };
	            request.send();
	        });
	        return promise;
	    };
	    AssetLoader.prototype.resolveAsset = function (url, name, type) {
	        var self = this;
	        var promise = new Promise(function (resolve, reject) {
	            self.resolveFile(url).then(function (data) {
	                self.assets[name] = new asset_1.Asset(data, name, type);
	                console.log("Resolved asset " + name);
	                resolve();
	            });
	        });
	        return promise;
	    };
	    AssetLoader.prototype.resolveImage = function (url, name, type) {
	        var self = this;
	        var promise = new Promise(function (resolve, reject) {
	            var image = new Image();
	            image.onload = function () {
	                console.log("image loaded");
	                self.assets[name] = new asset_1.Asset(image, name, type);
	                resolve();
	            };
	            image.src = url;
	        });
	        return promise;
	    };
	    AssetLoader.prototype.loadAll = function () {
	        var promises = [];
	        for (var i = 0; i < this.urls.length; i++) {
	            if (this.urls[i].type != "texture")
	                promises.push(this.resolveAsset(this.urls[i].url, this.urls[i].name, this.urls[i].type));
	            else
	                promises.push(this.resolveImage(this.urls[i].url, this.urls[i].name, this.urls[i].type));
	        }
	        var loadingPromise = Promise.all(promises).then(function () {
	            console.log("All _textureAssets loaded");
	        }).catch(function () {
	            console.log("Failed to load _textureAssets");
	        });
	        return loadingPromise;
	    };
	    AssetLoader.prototype.getAsset = function (assetName) {
	        return this.assets[assetName];
	    };
	    AssetLoader.prototype.getByType = function (type) {
	        var results = [];
	        var keys = Object.keys(this.assets);
	        for (var i = 0; i < keys.length; i++) {
	            if (this.assets[keys[i]].type == type)
	                results.push(this.assets[keys[i]]);
	        }
	        return results;
	    };
	    return AssetLoader;
	}());
	exports.AssetLoader = AssetLoader;


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Created by Jamie on 20-Jul-15.
	 */
	var Asset = (function () {
	    function Asset(data, name, type) {
	        this.data = data;
	        this.name = name;
	        this.type = type;
	    }
	    return Asset;
	}());
	exports.Asset = Asset;


/***/ },
/* 13 */
/***/ function(module, exports) {

	///<reference path="../../lib/gl-matrix.d.ts" />
	"use strict";
	var Camera = (function () {
	    //TODO: Camera needs a focal point and a camera point, needs to be possible to set both
	    function Camera(width, height, fov, znear, zfar) {
	        this.matrix = mat4.create();
	        this.position = mat4.create();
	        this.perspectiveMatrix = mat4.create();
	        var vec = vec3.fromValues(0, -2, -10);
	        mat4.translate(this.position, this.position, vec);
	        mat4.perspective(this.perspectiveMatrix, fov, width / height, znear, zfar);
	    }
	    Camera.prototype.getMatrix = function () {
	        var result = mat4.create();
	        mat4.multiply(result, this.position, this.matrix);
	        return result;
	    };
	    Camera.prototype.getPerspectiveMatrix = function () {
	        return this.perspectiveMatrix;
	    };
	    Camera.prototype.setMatrix = function (matrix) {
	        this.matrix = matrix;
	    };
	    return Camera;
	}());
	exports.Camera = Camera;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var mousePosition_1 = __webpack_require__(15);
	var arcballBehaviour_1 = __webpack_require__(16);
	var InputListener = (function () {
	    function InputListener(element) {
	        var self = this;
	        this.previousMouse = null;
	        this.currentMouse = null;
	        this.isLeftMouseDown = false;
	        this.isMiddleMouseDown = false;
	        this.cameraBehaviour = new arcballBehaviour_1.Arcball();
	        this.element = element;
	        element.onmousemove = function (evt) {
	            self.OnMouseMove(evt);
	        };
	        element.onmousedown = function (evt) {
	            switch (evt.which) {
	                case 1:
	                    self.isLeftMouseDown = true;
	                    break;
	                case 2:
	                    self.isMiddleMouseDown = true;
	                    break;
	            }
	        };
	        document.onmouseup = function (evt) {
	            switch (evt.which) {
	                case 1:
	                    self.isLeftMouseDown = false;
	                    self.onClick();
	                    break;
	                case 2:
	                    self.isMiddleMouseDown = false;
	                    break;
	            }
	        };
	        document.onkeydown = function (evt) {
	            if (evt.keyCode == 87) {
	                self.isMiddleMouseDown = true;
	            }
	        };
	        document.onkeyup = function (evt) {
	            if (evt.keyCode == 87) {
	                self.isMiddleMouseDown = false;
	            }
	        };
	    }
	    InputListener.prototype.setMouseMoveListener = function (listener) {
	        this.mouseMoveListener = listener;
	    };
	    InputListener.prototype.setMouseClickListener = function (listener) {
	        this.mouseClickListener = listener;
	    };
	    InputListener.prototype.setMouseRayListener = function (listener) {
	        this.mouseRayListener = listener;
	    };
	    InputListener.prototype.setKeyDownListener = function (listener) {
	        this.keyDownListener = listener;
	    };
	    InputListener.prototype.setKeyUpListener = function (listener) {
	        this.keyUpListener = listener;
	    };
	    InputListener.prototype.ControlCamera = function (camera) {
	        this.camera = camera;
	    };
	    InputListener.prototype.setOnCameraClickBehaviour = function (cameraClickBehaviour) {
	        this.cameraClickBehaviour = cameraClickBehaviour;
	    };
	    InputListener.prototype.OnMouseMove = function (evt) {
	        this.currentMouse = new mousePosition_1.MousePosition(evt.x, evt.y);
	        this.currentClientMouse = new mousePosition_1.MousePosition(evt.pageX - this.element.offsetLeft, evt.pageY - this.element.offsetTop);
	        if (!this.previousMouse)
	            this.previousMouse = this.currentMouse;
	        if (this.mouseMoveListener)
	            this.mouseMoveListener.onMouseMove(this.previousMouse.x, this.previousMouse.y, this.currentClientMouse.x, this.currentClientMouse.y);
	    };
	    InputListener.prototype.onClick = function () {
	        this.cameraClickBehaviour.onClick(this.currentClientMouse);
	        if (this.mouseClickListener)
	            this.mouseClickListener.onMouseClick(this.currentClientMouse.x, this.currentClientMouse.y);
	    };
	    InputListener.prototype.Update = function () {
	        if (!this.previousMouse || !this.currentMouse) {
	            return;
	        }
	        if (this.isMiddleMouseDown) {
	            this.camera.setMatrix(this.cameraBehaviour.CalculateMoveMatrix(this.previousMouse, this.currentMouse));
	        }
	        this.previousMouse = this.currentMouse;
	    };
	    return InputListener;
	}());
	exports.InputListener = InputListener;


/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	var MousePosition = (function () {
	    function MousePosition(x, y) {
	        this.x = x;
	        this.y = y;
	    }
	    return MousePosition;
	}());
	exports.MousePosition = MousePosition;


/***/ },
/* 16 */
/***/ function(module, exports) {

	///<reference path="../../../lib/gl-matrix.d.ts" />
	"use strict";
	var Arcball = (function () {
	    function Arcball() {
	        this.xRot = 0;
	        this.yRot = 0;
	    }
	    Arcball.prototype._GetArcballVector = function (x, y) {
	        var vec = vec3.fromValues(1 * x / 800 * 2 - 1, 1 * y / 600 * 2 - 1, 0);
	        vec[1] *= -1;
	        var OP_squared = vec[0] * vec[0] + vec[1] * vec[1];
	        if (OP_squared <= 1 * 1) {
	            vec[2] = Math.sqrt(1 * 1 - OP_squared); // Pythagore
	        }
	        else {
	        }
	        return vec;
	    };
	    Arcball.prototype.CalculateMoveMatrix = function (pointA, pointB) {
	        var result = mat4.create();
	        var prevCameraVector = this._GetArcballVector(pointA.x, pointA.y);
	        var nextCameraVector = this._GetArcballVector(pointB.x, pointB.y);
	        var prevCameraVectorX = vec3.fromValues(0, prevCameraVector[1], prevCameraVector[2]);
	        vec3.normalize(prevCameraVectorX, prevCameraVectorX);
	        var nextCameraVectorX = vec3.fromValues(0, nextCameraVector[1], nextCameraVector[2]);
	        vec3.normalize(nextCameraVectorX, nextCameraVectorX);
	        var xAngle = Math.acos(Math.min(1.0, vec3.dot(prevCameraVectorX, nextCameraVectorX)));
	        if (nextCameraVector[1] - prevCameraVector[1] < 0) {
	            this.xRot += xAngle;
	        }
	        else if (nextCameraVector[1] - prevCameraVector[1] > 0) {
	            this.xRot -= xAngle;
	        }
	        if (this.xRot > Math.PI * 2) {
	            this.xRot = 0;
	        }
	        if (this.xRot < 0) {
	            this.xRot = Math.PI * 2;
	        }
	        mat4.rotate(result, result, this.xRot, vec3.fromValues(1, 0, 0));
	        var prevCameraVectorY = vec3.fromValues(prevCameraVector[0], 0, prevCameraVector[2]);
	        vec3.normalize(prevCameraVectorY, prevCameraVectorY);
	        var nextCameraVectorY = vec3.fromValues(nextCameraVector[0], 0, nextCameraVector[2]);
	        vec3.normalize(nextCameraVectorY, nextCameraVectorY);
	        var yAngle = Math.acos(Math.min(1.0, vec3.dot(prevCameraVectorY, nextCameraVectorY)));
	        if (nextCameraVector[0] - prevCameraVector[0] < 0) {
	            this.yRot -= yAngle;
	        }
	        else if (nextCameraVector[0] - prevCameraVector[0] > 0) {
	            this.yRot += yAngle;
	        }
	        if (this.yRot > Math.PI * 2) {
	            this.yRot = 0;
	        }
	        if (this.yRot < 0) {
	            this.yRot = Math.PI * 2;
	        }
	        mat4.rotate(result, result, this.yRot, vec3.fromValues(0, 1, 0));
	        return result;
	    };
	    return Arcball;
	}());
	exports.Arcball = Arcball;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Tile = __webpack_require__(18);
	var DebugLine = __webpack_require__(6);
	var tileMap_1 = __webpack_require__(20);
	var Peon = __webpack_require__(21);
	var Ray = __webpack_require__(22);
	var imageMap_1 = __webpack_require__(23);
	/**
	 * Created by Jamie on 14-Jun-15.
	 */
	var Scene = (function () {
	    function Scene(engine) {
	        this.engine = engine;
	        this.engine.graphics._lightDir = [0, 1, 0];
	        this.sceneGraph = this.engine.sceneGraph;
	        this.sceneGraph.setScene(this);
	        this.engine.input.setMouseClickListener(this);
	    }
	    Scene.prototype.drawDebugLine = function (p1, p2) {
	        this.sceneGraph.debugGraph.push(new DebugLine(this.engine.graphics.ctx, p1, p2));
	    };
	    Scene.prototype.onStart = function () {
	        this.selectTile = new Tile(this.engine);
	        var tileMap = new tileMap_1.TileMap(1, 1);
	        var imageMap = new imageMap_1.ImageMap(this.engine.graphics.assetCollection.getTexture("tileMap"), 1024, 1024, 256, 256);
	        tileMap.setImageMap(imageMap);
	        var bottomTileLevel = new tileMap_1.TileLevel(tileMap);
	        for (var x = 0; x < 100; x++) {
	            for (var y = 0; y < 100; y++) {
	                var tile = new tileMap_1.TileMapTile(x - 50, 0, y - 50);
	                var rnd = Math.random();
	                if (rnd > 0.2) {
	                    tile.setImageMapIndex(4);
	                }
	                else {
	                    var randomTextureIndex = Math.round(Math.random() * 16);
	                    tile.setImageMapIndex(randomTextureIndex);
	                }
	                bottomTileLevel.setTile(x * 100 + y, tile);
	            }
	        }
	        tileMap.getTileLevels().push(bottomTileLevel);
	        this.engine.graphics.tileMapRenderer.setTileMap(tileMap);
	        this.engine.graphics._lightDir = [0, 1, 0];
	        this.selectTile.setPosition(0, 50, 0);
	        this.selectTile.setScaleSingle(1);
	        this.engine.sceneGraph.addEntity(this.selectTile);
	    };
	    Scene.prototype.onUpdate = function () {
	    };
	    Scene.prototype.onMouseClick = function (x, y) {
	        var peon = new Peon(this.engine);
	        peon.setPosition(this.selectTile.x + 0.5, 0, this.selectTile.z + 0.5);
	        this.sceneGraph.addEntity(peon);
	    };
	    Scene.prototype.onMouseMove = function (fromX, fromY, toX, toY) {
	        var x = ((toX * 2) / 800) - 1;
	        var y = 1 - ((toY * 2) / 600);
	        var ray = new Ray(x, y);
	        var position = ray.getYPlaneIntersection(this.engine.camera.getMatrix(), null);
	        this.selectTile.setPosition(position[0], 0.01, position[2]);
	    };
	    Scene.prototype.unproject = function (winx, winy, winz, mat, viewport) {
	        winz = 2 * winz - 1;
	        var invMat = mat4.create();
	        mat4.invert(invMat, mat);
	        var n = vec4.fromValues(winx, winy, winz, 1);
	        vec4.transformMat4(n, n, invMat);
	        var n2 = vec3.fromValues(n[0] / n[3], n[1] / n[3], n[2] / n[3]);
	        return n2;
	    };
	    return Scene;
	}());
	exports.Scene = Scene;
	;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var GameObject = __webpack_require__(19);
	/**
	 * Created by Jamie on 05-Jul-15.
	 */
	var Tile = (function (_super) {
	    __extends(Tile, _super);
	    function Tile(engine) {
	        var _this = _super.call(this) || this;
	        _this.engine = engine;
	        _this.setMesh(engine.graphics.assetCollection.getMesh("square"));
	        _this.setTexture(engine.graphics.assetCollection.getTexture("selectTile"));
	        return _this;
	    }
	    return Tile;
	}(GameObject));
	module.exports = Tile;


/***/ },
/* 19 */
/***/ function(module, exports) {

	/**
	 * Created by Jamie on 02-Jul-15.
	 */
	"use strict";
	var GameObject = (function () {
	    function GameObject() {
	        this.visible = true;
	        this.orientation = mat4.create();
	        this.scaleX = 1;
	        this.scaleY = 1;
	        this.scaleZ = 1;
	        this.setPosition(0, 0, 0);
	    }
	    GameObject.prototype.setMesh = function (mesh) {
	        this.mesh = mesh;
	    };
	    GameObject.prototype.setTexture = function (texture) {
	        this.texture = texture;
	    };
	    GameObject.prototype.getBoundingCube = function () {
	        var boundingCube = this.mesh.getBoundingCube();
	        return boundingCube;
	    };
	    GameObject.prototype.setPosition = function (x, y, z) {
	        this.x = x;
	        this.y = y;
	        this.z = z;
	    };
	    GameObject.prototype.setScaleSingle = function (scale) {
	        this.scaleX = scale;
	        this.scaleY = scale;
	        this.scaleZ = scale;
	    };
	    GameObject.prototype.setOrientation = function (orientation) {
	        this.orientation = orientation;
	    };
	    GameObject.prototype.getMatrix = function () {
	        var matrix = mat4.create();
	        mat4.translate(matrix, matrix, vec3.fromValues(this.x, this.y, this.z));
	        mat4.mul(matrix, matrix, this.orientation);
	        var scale = mat4.create();
	        mat4.scale(scale, scale, vec3.fromValues(this.scaleX, this.scaleY, this.scaleZ));
	        mat4.mul(matrix, matrix, scale);
	        return matrix;
	    };
	    GameObject.prototype.update = function (delta) {
	    };
	    return GameObject;
	}());
	module.exports = GameObject;


/***/ },
/* 20 */
/***/ function(module, exports) {

	/**
	 * Created by Jamie on 25-Jul-15.
	 */
	"use strict";
	var TileMap = (function () {
	    function TileMap(tileWidth, tileHeight) {
	        this.tileWidth = tileWidth;
	        this.tileHeight = tileHeight;
	        this.tileLevels = [];
	        this.isInvalidated = true;
	    }
	    TileMap.prototype.setImageMap = function (imageMap) {
	        this.imageMap = imageMap;
	    };
	    TileMap.prototype.getImageMap = function () {
	        return this.imageMap;
	    };
	    TileMap.prototype.getTileLevels = function () {
	        return this.tileLevels;
	    };
	    TileMap.prototype.getTileWidth = function () {
	        return this.tileWidth;
	    };
	    TileMap.prototype.getTileHeight = function () {
	        return this.tileHeight;
	    };
	    TileMap.prototype.reset = function () {
	        this.isInvalidated = false;
	    };
	    TileMap.prototype.invalidate = function () {
	        this.isInvalidated = true;
	    };
	    return TileMap;
	}());
	exports.TileMap = TileMap;
	var TileLevel = (function () {
	    function TileLevel(invalidationListener) {
	        this.tiles = [];
	        this.invalidationListener = invalidationListener;
	    }
	    TileLevel.prototype.getTiles = function () {
	        return this.tiles;
	    };
	    TileLevel.prototype.setTiles = function (tileMapTiles) {
	        this.tiles = tileMapTiles;
	        this.invalidationListener.invalidate();
	    };
	    TileLevel.prototype.setTile = function (index, tile) {
	        this.tiles[index] = tile;
	        this.invalidationListener.invalidate();
	    };
	    return TileLevel;
	}());
	exports.TileLevel = TileLevel;
	var TileMapTile = (function () {
	    function TileMapTile(x, y, z) {
	        this.x = x;
	        this.y = y;
	        this.z = z;
	        this.imageMapIndex = 0;
	    }
	    TileMapTile.prototype.setImageMapIndex = function (index) {
	        this.imageMapIndex = index;
	    };
	    TileMapTile.prototype.getImageMapIndex = function () {
	        return this.imageMapIndex;
	    };
	    return TileMapTile;
	}());
	exports.TileMapTile = TileMapTile;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var GameObject = __webpack_require__(19);
	/**
	 * Created by Jamie on 05-Jul-15.
	 */
	var Peon = (function (_super) {
	    __extends(Peon, _super);
	    function Peon(engine) {
	        var _this = _super.call(this) || this;
	        _this.maxX = -100;
	        _this.maxZ = -100;
	        _this.timer = 0;
	        _this.nextChange = 0;
	        _this.engine = engine;
	        _this.setMesh(engine.graphics.assetCollection.getMesh("man"));
	        _this.setTexture(engine.graphics.assetCollection.getTexture("mantexture"));
	        _this.setScaleSingle(0.2);
	        _this.randomOrientation();
	        return _this;
	    }
	    Peon.prototype.randomOrientation = function () {
	        this.direction = vec2.fromValues(Math.random() * 2 - 1, Math.random() * 2 - 1);
	        vec2.normalize(this.direction, this.direction);
	        this.nextChange = Math.random() * 150 + 10;
	    };
	    Peon.prototype.update = function () {
	        this.timer++;
	        if (this.timer > this.nextChange) {
	            this.randomOrientation();
	            this.timer = 0;
	        }
	        this.x += this.direction[0] * 0.01;
	        this.z += this.direction[1] * 0.01;
	        if (this.x > 50 || this.x < -50) {
	            this.direction[0] *= -1;
	        }
	        if (this.z > 50 || this.z < -50) {
	            this.direction[1] *= -1;
	        }
	    };
	    return Peon;
	}(GameObject));
	module.exports = Peon;


/***/ },
/* 22 */
/***/ function(module, exports) {

	/**
	 * Created by Jamie on 02-Aug-15.
	 */
	///<reference path="../../lib/gl-matrix.d.ts" />
	"use strict";
	var Ray = (function () {
	    /**
	     * @param x The xposition of the ray in clip space
	     * @param y The yPosition of the ray in clip space
	     */
	    function Ray(x, y) {
	        this.x = x;
	        this.y = y;
	    }
	    /**
	     * @param modelView The matrix representing the modelView
	     */
	    Ray.prototype.getInWorld = function (modelView) {
	        var perspective = mat4.create();
	        mat4.perspective(perspective, 45, 800 / 600, 0.1, 100.0);
	        mat4.mul(perspective, perspective, modelView);
	        var mouseClipNear = this.unproject(this.x, this.y, -1, perspective, [0, 0, 600, 600]);
	        var mouseClipFar = this.unproject(this.x, this.y, 0, perspective, [0, 0, 600, 600]);
	        var dir = vec3.create();
	        vec3.sub(dir, mouseClipFar, mouseClipNear);
	        vec3.normalize(dir, dir);
	        return dir;
	    };
	    /**
	     * @param modelView The matrix representing the modelView
	     * @param yPosition (optional) raise the yPlane by the specified amount
	     */
	    Ray.prototype.getYPlaneIntersection = function (modelView, yPosition) {
	        var dir = this.getInWorld(modelView);
	        var inverseCamera = mat4.create();
	        mat4.invert(inverseCamera, modelView);
	        var cameraPosition = vec3.fromValues(inverseCamera[12], inverseCamera[13], inverseCamera[14]);
	        var distance = -cameraPosition[1] / dir[1];
	        vec3.scale(dir, dir, distance);
	        var roundexX = Math.floor(cameraPosition[0] + dir[0]);
	        var roundedZ = Math.floor(cameraPosition[2] + dir[2]);
	        return [roundexX, 0, roundedZ];
	    };
	    Ray.prototype.unproject = function (winx, winy, winz, mat, viewport) {
	        winz = 2 * winz - 1;
	        var invMat = mat4.create();
	        mat4.invert(invMat, mat);
	        var n = vec4.fromValues(winx, winy, winz, 1);
	        vec4.transformMat4(n, n, invMat);
	        var n2 = vec3.fromValues(n[0] / n[3], n[1] / n[3], n[2] / n[3]);
	        return n2;
	    };
	    return Ray;
	}());
	module.exports = Ray;


/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";
	var ImageMap = (function () {
	    function ImageMap(texture, width, height, tileWidth, tileHeight) {
	        this.width = width;
	        this.height = height;
	        this.texture = texture;
	        this.tileWidth = tileWidth;
	        this.tileHeight = tileHeight;
	    }
	    ImageMap.prototype.getTexture = function () {
	        return this.texture;
	    };
	    /**
	     *
	     * @param index
	     * @returns {Array} The array of the texture positions of the four corners of the tile
	     */
	    ImageMap.prototype.getCoordsAtIndex = function (index) {
	        var finalWidth = index * this.tileWidth;
	        var x, y;
	        if (finalWidth >= this.width) {
	            var rowNum = Math.floor(finalWidth / this.width);
	            var offset = finalWidth % this.width;
	            x = offset;
	            y = rowNum * this.tileHeight;
	        }
	        else {
	            x = finalWidth;
	            y = 0;
	        }
	        var result = [];
	        //bottom left
	        result.push(x / this.width);
	        result.push((y + this.tileHeight) / this.height);
	        //bottom right
	        result.push((x + this.tileWidth) / this.width);
	        result.push((y + this.tileHeight) / this.height);
	        //top right
	        result.push((x + this.tileWidth) / this.width);
	        result.push(y / this.height);
	        //top left
	        result.push(x / this.width);
	        result.push(y / this.height);
	        return result;
	    };
	    ImageMap.prototype.doSomething = function () {
	        return "hi";
	    };
	    return ImageMap;
	}());
	exports.ImageMap = ImageMap;


/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Created by Jamie on 28-Jun-15.
	 */
	var Scenegraph = (function () {
	    function Scenegraph() {
	        this.graph = [];
	        this.debugGraph = [];
	        this.transparentGraph = [];
	    }
	    Scenegraph.prototype.addEntity = function (entity) {
	        this.graph.push(entity);
	    };
	    Scenegraph.prototype.addTransparentEntity = function (entity) {
	        this.transparentGraph.push(entity);
	    };
	    Scenegraph.prototype.setScene = function (scene) {
	        this.currentScene = scene;
	    };
	    Scenegraph.prototype.update = function (delta) {
	        for (var i = 0; i < this.graph.length; i++) {
	            this.graph[i].update(0);
	        }
	    };
	    return Scenegraph;
	}());
	exports.Scenegraph = Scenegraph;
	;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var mousePosition_1 = __webpack_require__(15);
	var CameraClickPickerBehaviour = (function () {
	    function CameraClickPickerBehaviour(sceneGraph, camera) {
	        this.sceneGraph = sceneGraph;
	        this.camera = camera;
	    }
	    CameraClickPickerBehaviour.prototype.setViewportDimensions = function (width, height) {
	        this.viewportWidth = width;
	        this.viewportHeight = height;
	    };
	    CameraClickPickerBehaviour.prototype.getClipCameraPosition = function (position) {
	        var x = ((position.x * 2) / this.viewportWidth) - 1;
	        var y = 1.0 - ((position.y * 2) / this.viewportHeight);
	        return new mousePosition_1.MousePosition(x, y);
	    };
	    CameraClickPickerBehaviour.prototype.onClick = function (position) {
	        for (var i = 0; i < this.sceneGraph.graph.length; i++) {
	            var entity = this.sceneGraph.graph[i];
	            if (this.isClickOnEntity(this.getClipCameraPosition(position), entity, this.camera.getMatrix())) {
	            }
	        }
	    };
	    CameraClickPickerBehaviour.prototype.isClickOnEntity = function (click, entity, cameraMatrix) {
	        //TODO: Figure out why ZNear has to be 1
	        var perspective = mat4.create();
	        mat4.perspective(perspective, 45, 800 / 600, 0.1, 100.0);
	        mat4.mul(perspective, perspective, cameraMatrix);
	        var mouseClipNear = this.unproject(click.x, click.y, -1, perspective, [0, 0, 600, 600]);
	        var mouseClipFar = this.unproject(click.x, click.y, 0, perspective, [0, 0, 600, 600]);
	        var dir = vec3.create();
	        vec3.sub(dir, mouseClipFar, mouseClipNear);
	        vec3.normalize(dir, dir);
	        var inverseCamera = mat4.create();
	        mat4.invert(inverseCamera, cameraMatrix);
	        var cameraPosition = vec3.fromValues(inverseCamera[12], inverseCamera[13], inverseCamera[14]);
	        var result2 = vec3.create();
	        vec3.copy(result2, dir);
	        vec3.scale(result2, result2, 100);
	        vec3.add(result2, cameraPosition, result2);
	        this.sceneGraph.currentScene.drawDebugLine(cameraPosition, result2);
	        var boundingCube = entity.getBoundingCube();
	        boundingCube.transform(entity.getMatrix());
	        //console.log(boundingCube);
	        var result = this.testRayOBBIntersection(cameraPosition, dir, boundingCube);
	        if (result) {
	            console.log("hit");
	        }
	        else {
	        }
	    };
	    CameraClickPickerBehaviour.prototype.testRayOBBIntersection = function (point, vector, box) {
	        var values = ["x", "y", "z"];
	        var tmin = 0;
	        var tmax = 10000000;
	        for (var i = 0; i < 3; i++) {
	            if (Math.abs(vector[i]) < 0.0001) {
	                //parallel
	                if (point[i] < box.lowest[i] || point[i] > box.highest[i]) {
	                    //console.log("Failed on containment check for " + values[i]);
	                    return null;
	                }
	            }
	            else {
	                var ood = 1.0 / vector[i];
	                var t1 = (box.lowest[i] - point[i]) * ood;
	                var t2 = (box.highest[i] - point[i]) * ood;
	                //console.log("t1 " + t1 + " t2 " + t2);
	                if (t1 > t2) {
	                    //swap
	                    var w = t1;
	                    t1 = t2;
	                    t2 = w;
	                }
	                if (t1 > tmin)
	                    tmin = t1;
	                if (t2 < tmax)
	                    tmax = t2;
	                if (tmin > tmax) {
	                    //console.log("Failed on min check for " + values[i]);
	                    //console.log("With tmin: " + tmin + " tmax: " + tmax);
	                    return null;
	                }
	            }
	        }
	        var collisionPoint = vec3.create();
	        vec3.scale(collisionPoint, vector, tmin);
	        vec3.add(collisionPoint, collisionPoint, point);
	        return collisionPoint;
	    };
	    /* unproject - convert screen coordinate to WebGL Coordinates
	     *   winx, winy - point on the screen
	     *   winz       - winz=0 corresponds to newPoint and winzFar corresponds to farPoint
	     *   mat        - model-view-projection matrix
	     *   viewport   - array describing the canvas [x,y,width,height]
	     */
	    CameraClickPickerBehaviour.prototype.unproject = function (winx, winy, winz, mat, viewport) {
	        winz = 2 * winz - 1;
	        var invMat = mat4.create();
	        mat4.invert(invMat, mat);
	        var n = vec4.fromValues(winx, winy, winz, 1);
	        vec4.transformMat4(n, n, invMat);
	        var n2 = vec3.fromValues(n[0] / n[3], n[1] / n[3], n[2] / n[3]);
	        return n2;
	    };
	    return CameraClickPickerBehaviour;
	}());
	exports.CameraClickPickerBehaviour = CameraClickPickerBehaviour;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map