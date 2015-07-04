define(["require", "exports"], function (require, exports) {
    /**
     * Created by Jamie on 28-Jun-15.
     */
    var Scenegraph = (function () {
        function Scenegraph() {
            this.graph = [];
        }
        Scenegraph.prototype.addEntity = function (entity) {
            this.graph.push(entity);
        };
        return Scenegraph;
    })();
    exports.Scenegraph = Scenegraph;
    ;
});
//# sourceMappingURL=scenegraph.js.map