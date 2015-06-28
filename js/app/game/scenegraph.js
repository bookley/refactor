/**
 * Created by Jamie on 28-Jun-15.
 */
define([], function(){
    function Scenegraph(){
        this.graph = [];
    }

    Scenegraph.prototype.addEntity = function(entity){
        this.graph.push(entity);
    }

    return Scenegraph;
});