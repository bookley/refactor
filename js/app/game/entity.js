/**
 * Created by Jamie on 14-Jun-15.
 */

define([], function(){
    function Entity(){
        this.mesh = null;
        this.position = vec3.create();
        this.orientation = mat4.create();

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.scale = {
            x: 1,
            y: 1,
            z: 1
        };
    }

    Entity.prototype.setMesh = function(mesh){
        this.mesh = mesh;
    }

    Entity.prototype.setPosition = function(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    Entity.prototype.setScaleSingle = function(scale){
        this.scale = {
            x: scale,
            y: scale,
            z: scale
        }
    }

    return Entity;
});