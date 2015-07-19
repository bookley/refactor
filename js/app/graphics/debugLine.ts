export class DebugLine {

    ctx:WebGLRenderingContext;
    vertexBuffer:WebGLRenderbuffer;
    colorBuffer:WebGLRenderbuffer;
    indexBuffer:WebGLRenderbuffer;

    constructor(ctx:WebGLRenderingContext, pos1:Float32Array, pos2:Float32Array){
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

    Draw(shader:any, modelMatrix:mat4):void{
        //Need to have texture//colours bound at this point
        //if this.material -> this.material.bind
        //add something to notify if shader.attributes["name"] doesn't exist
        //console.log("drawing");
        shader.PassMatrix("uMVMatrix", modelMatrix);

        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vertexBuffer);
        this.ctx.vertexAttribPointer(shader.attributes["aVertexPosition"], 3, this.ctx.FLOAT, false, 0, 0);

        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.colorBuffer);
        this.ctx.vertexAttribPointer(shader.attributes["aVertexColour"], 3, this.ctx.FLOAT, false, 0, 0);

        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.ctx.drawElements(this.ctx.LINES, 2, this.ctx.UNSIGNED_SHORT, 0);
    }
}