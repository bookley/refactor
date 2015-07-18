/**
 * Created by Jamie on 28-Jun-15.
 */
define(["require", "exports"], function (require, exports) {
    var Scenegraph = (function () {
        function Scenegraph() {
            this.graph = [];
            this.debugGraph = [];
        }
        Scenegraph.prototype.addEntity = function (entity) {
            this.graph.push(entity);
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
    })();
    exports.Scenegraph = Scenegraph;
    ;
});
//# sourceMappingURL=scenegraph.js.map