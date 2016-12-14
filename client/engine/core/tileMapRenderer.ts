import {mat4, vec3} from 'gl-matrix';
import {TileMap, TileLevel, TileMapTile} from "../game/tileMap";
import Shader = require("./shaders");
/**
 * Created by Jamie on 26-Jul-15.
 */



class TileMapRenderer {
    private ctx:WebGLRenderingContext;
    private vertexBuffer:WebGLBuffer;
    private indexBuffer:WebGLBuffer;
    private normalBuffer:WebGLBuffer;
    private texturePositionBuffer:WebGLBuffer;

    private tileMap:TileMap;

    private tileIndex:number;

    private vertices:number[];
    private indices:number[];
    private texCoords:number[];
    private normals:number[];

    constructor(ctx:WebGLRenderingContext){
        this.ctx = ctx;
        this.tileIndex = 0;

        this.vertexBuffer = ctx.createBuffer();
        this.normalBuffer = ctx.createBuffer();
        this.indexBuffer = ctx.createBuffer();
        this.texturePositionBuffer = ctx.createBuffer();
    }

    setTileMap(tileMap:TileMap): void {
        this.tileMap = tileMap;
        this.calculateDataForTileMap(tileMap);
        this.updateData();
    }

    updateData(){
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.vertices), this.ctx.DYNAMIC_DRAW);

        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normalBuffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.normals), this.ctx.DYNAMIC_DRAW);

        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.texturePositionBuffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.texCoords), this.ctx.DYNAMIC_DRAW);

        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.ctx.DYNAMIC_DRAW);
    }

    bindPositionBuffer(shader:any):void {
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
        this.ctx.vertexAttribPointer(shader.attributes["aVertexPosition"], 3, this.ctx.FLOAT, false, 0, 0);
    }

    bindNormalBuffer(shader:any):void {
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.normalBuffer);
        this.ctx.vertexAttribPointer(shader.attributes["aVertexNormal"], 3, this.ctx.FLOAT, false, 0, 0);
    }

    bindTextureCoordinatesBuffer(shader:any):void {
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.texturePositionBuffer);
        this.ctx.vertexAttribPointer(shader.attributes["aTexCoords"], 2, this.ctx.FLOAT, false, 0, 0);
    }

    bindIndexBuffer(shader:any):void {
        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }

    draw(shader:Shader, perspectiveMatrix:mat4, cameraMatrix:mat4, modelMatrix:mat4, lightDirection:vec3){
        shader.passMatrix("uPMatrix", perspectiveMatrix);
        shader.passVec3("lightDirection", lightDirection);
        shader.passMatrix("uCMatrix", cameraMatrix);
        shader.passMatrix("uMVMatrix", modelMatrix);

        this.tileMap.getImageMap().getTexture().bind();
        this.bindPositionBuffer(shader);
        this.bindNormalBuffer(shader);
        this.bindTextureCoordinatesBuffer(shader);
        this.bindIndexBuffer(shader);
        this.ctx.drawElements(this.ctx.TRIANGLES, this.indices.length, this.ctx.UNSIGNED_SHORT, 0);
    }

    calculateDataForTileMap(tileMap:TileMap) {
        this.vertices = [];
        this.indices = [];
        this.texCoords = [];
        this.normals = [];

        this.tileIndex = 0;

        var tileLevels = tileMap.getTileLevels();
        var result = [];
        for(var i = 0; i < tileLevels.length; i++){
            var tileLevel = tileLevels[i];
            this.calculateDataForTileLevel(tileLevel);
        }
    }

    calculateDataForTileLevel(tileLevel:TileLevel){
        var tiles = tileLevel.getTiles();
        var result = [];
        for(var i = 0; i < tiles.length; i++){
            var tile = tiles[i];
            this.calculateDataForTile(tile);
        }
        return result;
    }

    calculateDataForTile(tile:TileMapTile){
        var left = tile.x;
        var bottom = tile.z;

        var right = tile.x + this.tileMap.getTileWidth();
        var top = tile.z + this.tileMap.getTileHeight();


        var y = tile.y;

        var vertices = [
            // Front face
            left, y,  bottom, //bottom left
            right, y,  bottom, //bottom right
            right,  y,  top, //top right
            left,  y,  top]; //top left

        var indices = [0 + this.tileIndex, 1 + this.tileIndex, 2 + this.tileIndex, 0 + this.tileIndex, 2 + this.tileIndex, 3 + this.tileIndex];

        var normals = [
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
        ];

        var texCoords = this.tileMap.getImageMap().getCoordsAtIndex(tile.getImageMapIndex());
        this.tileIndex +=4;

        Array.prototype.push.apply(this.vertices, vertices);
        Array.prototype.push.apply(this.indices, indices);
        Array.prototype.push.apply(this.normals, normals);
        Array.prototype.push.apply(this.texCoords, texCoords)
    }
}

export = TileMapRenderer;