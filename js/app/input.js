define([], function(){
    function Input(element){
        var self = this;
        this.element = element;
        this.pM = null;
        this.cM = null;
        this.isMouseDown = false;

        element.onmousemove =  function(evt){
            self.OnMouseMove(evt);
        }

        element.onmousedown = function(evt){
            if(evt.which == 1){
                self.isMouseDown = true;
            }
        }

        document.onmouseup = function(evt){
            if(evt.which == 1){
                self.isMouseDown = false;
            }
        }
    }

    Input.prototype.ControlCamera = function(camera){
        this.camera = camera;
    }

    Input.prototype.OnMouseMove = function(evt){
        this.cM = {
            x: evt.x,
            y: evt.y
        };

        if(!this.pM) this.pM = this.cM;
    }

    Input.prototype.Update = function(){
        if(!this.pM || !this.cM){
            return;
        }

        if(this.isMouseDown) {
            var transf = this.CalculateMoveMatrix(this.pM, this.cM);
            mat4.multiply(this.camera.matrix, this.camera.matrix, transf);
        }
        this.pM = this.cM;
    }

    Input.prototype.GetArcballVector = function(x, y){
        var vec = vec3.fromValues(
            1 * x / this.element.width * 2 - 1,
            1 * y / this.element.height * 2 - 1,
            0
        );
        vec[1] *=-1;

        var OP_squared = vec[0] * vec[0] + vec[1] * vec[1];
        if (OP_squared <= 1*1)
            vec[2] = Math.sqrt(1*1 - OP_squared);  // Pythagore
        else
            vec3.normalize(vec, vec);  // nearest point

        return vec;
    }

    Input.prototype.CalculateMoveMatrix = function(pointA, pointB){
        var result = mat4.create();
        if(pointA.x == pointB.x && pointA.y == pointB.y){
            return result;
        }

        var a = this.GetArcballVector(pointA.x, pointA.y);
        var b = this.GetArcballVector(pointB.x, pointB.y);

        var angle = Math.acos(Math.min(1.0, vec3.dot(a, b)));
        var axis = vec3.create();
        vec3.cross(axis, a, b);

        var inv = mat4.create();
        mat4.invert(inv, this.camera.matrix);
        mat4.multiply(result, result, inv);

        mat4.rotate(result, result, angle, axis);

        mat4.multiply(result, result, this.camera.matrix);

        return result;
    }

    return Input;
})