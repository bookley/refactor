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
//# sourceMappingURL=context.js.map