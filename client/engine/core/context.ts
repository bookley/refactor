/**
 * Responsible for wrapping up all calls to the WebGL context to ensure
 * the entire framework can be mocked
 */
export interface Context {
    clearColor(r:number, g:number, b:number, a:number);
    setDepthTestEnabled(value:boolean);
    setVertexAttribArrayEnabled(arrayIndex:number, value:boolean);
    getError():number;
}

export class DefaultContext implements Context {

    ctx:WebGLRenderingContext;

    constructor(canvas:HTMLCanvasElement){
        this.ctx = canvas.getContext("webgl");
    }

    clearColor(r:number, g:number, b:number, a:number) {
      this.ctx.clearColor(r, g, b, a);
    }

    setDepthTestEnabled(value:boolean){
        if(value)
            this.ctx.enable(this.ctx.DEPTH_TEST);
        else
            this.ctx.disable(this.ctx.DEPTH_TEST);
    }

    setVertexAttribArrayEnabled(arrayIndex:number, value:boolean){
        if(value)
            this.ctx.enableVertexAttribArray(arrayIndex);
        else
            this.ctx.disableVertexAttribArray(arrayIndex);
    }

    getError():number{
        return this.ctx.getError();
    }

}