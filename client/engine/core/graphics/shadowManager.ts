
import {Camera} from "../../camera/camera";
import {mat4} from "gl-matrix";
export default class ShadowManager {

    private _ctx: WebGLRenderingContext;
    private _dimension: number;
    private _bias: number;

    private _renderBuffer: WebGLRenderbuffer;
    private _texture: WebGLTexture;
    private _frameBuffer: WebGLFramebuffer;

    constructor(ctx: WebGLRenderingContext, dimension:number, bias:number){
        this._ctx = ctx;
        this._dimension = dimension;
        this._bias = bias;

        let depthTextureExt = this._ctx.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix
        if(!depthTextureExt) { console.error("No depth texture extension"); }

        this._renderBuffer = this._ctx.createRenderbuffer();
        this._ctx.bindRenderbuffer(this._ctx.RENDERBUFFER, this._renderBuffer);
        this._ctx.renderbufferStorage(this._ctx.RENDERBUFFER, this._ctx.DEPTH_COMPONENT16, dimension, dimension);

        this._texture = this._ctx.createTexture();
        this._ctx.bindTexture(this._ctx.TEXTURE_2D, this._texture);
        this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_MIN_FILTER, this._ctx.LINEAR);
        this._ctx.texImage2D(this._ctx.TEXTURE_2D, 0, this._ctx.RGBA, dimension, dimension, 0, this._ctx.RGBA, this._ctx.UNSIGNED_BYTE, null);

        this._frameBuffer = this._ctx.createFramebuffer();
        this._ctx.bindFramebuffer(this._ctx.FRAMEBUFFER, this._frameBuffer);
        this._ctx.framebufferTexture2D(this._ctx.FRAMEBUFFER, this._ctx.COLOR_ATTACHMENT0, this._ctx.TEXTURE_2D, this._texture, 0);
        this._ctx.framebufferRenderbuffer(this._ctx.FRAMEBUFFER, this._ctx.DEPTH_ATTACHMENT, this._ctx.RENDERBUFFER, this._renderBuffer);
        this.unbind();
    }

    bind(): void {
        this._ctx.bindFramebuffer(this._ctx.FRAMEBUFFER, this._frameBuffer);
    }

    unbind(): void {
        this._ctx.bindFramebuffer(this._ctx.FRAMEBUFFER, null);
        this._ctx.bindRenderbuffer(this._ctx.RENDERBUFFER, null);
        this._ctx.bindTexture(this._ctx.TEXTURE_2D, null);
    }

    draw(camera: Camera, scenegraph, shader, lightDir) {
        if (!camera) throw new Error("Can't draw if a camera isn't set");
        this._ctx.enable(this._ctx.DEPTH_TEST);
        for (var i = 0; i < scenegraph.graph.length; i++) {
            var entity = scenegraph.graph[i];
            if(!entity.visible) continue;

            var modelMatrix = entity.getMatrix();
            if (entity.texture != null) {
                entity.texture.bind();
            }
            entity.mesh.draw(shader, camera.viewMatrix, mat4.create(), modelMatrix, lightDir);
        }
    }

    get texture(){
        return this._texture;
    }
}