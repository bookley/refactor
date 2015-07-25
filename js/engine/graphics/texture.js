define(["require", "exports"], function (require, exports) {
    /**
     * Created by Jamie on 28-Jun-15.
     */
    var Texture = (function () {
        function Texture(ctx, img) {
            if (ctx == null)
                throw new Error("Ctx cannot be null for texture to load");
            this.ctx = ctx;
            this.image = img;
            this.id = this.ctx.createTexture();
            this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.id);
            this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, this.image);
            this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.LINEAR);
            this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.LINEAR);
            this.ctx.generateMipmap(this.ctx.TEXTURE_2D);
            this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);
        }
        Texture.prototype.Bind = function () {
            this.ctx.activeTexture(this.ctx.TEXTURE0);
            this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.id);
        };
        return Texture;
    })();
    return Texture;
});
//# sourceMappingURL=texture.js.map