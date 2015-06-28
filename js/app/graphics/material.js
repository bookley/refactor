/**
 * Created by Jamie on 12-Apr-15.
 */
define([], function() {
    function Material(ctx) {
        this.ctx = ctx;
    }

    Material.prototype.Load = function(texture){
        this.texture = texture;
        this.glTexture = this.ctx.createTexture();

        this.bindTexture(this.glTexture);
    }

    Material.prototype.Bind = function(){

    }
});