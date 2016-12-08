"use strict";
/**
 * Created by Jamie on 28-Jun-15.
 */
var Scenegraph = (function () {
    function Scenegraph() {
        this.graph = [];
        this.debugGraph = [];
        this.transparentGraph = [];
    }
    Scenegraph.prototype.addEntity = function (entity) {
        this.graph.push(entity);
    };
    Scenegraph.prototype.addTransparentEntity = function (entity) {
        this.transparentGraph.push(entity);
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
}());
exports.Scenegraph = Scenegraph;
;
//# sourceMappingURL=scenegraph.js.map