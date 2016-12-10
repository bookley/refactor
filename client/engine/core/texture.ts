/**
 * Created by Jamie on 28-Jun-15.
 */
class Texture {
    ctx:WebGLRenderingContext;
    image:HTMLImageElement;
    id:WebGLTexture;

    constructor(ctx:WebGLRenderingContext, img:HTMLImageElement){
        if(ctx == null) throw new Error("Ctx cannot be null for texture to load");
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

    bind(){
        this.ctx.enable(this.ctx.BLEND);
        this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
        this.ctx.activeTexture(this.ctx.TEXTURE0);
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.id);
    }
}

export = Texture;