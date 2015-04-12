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
        if (OP_squared <= 1*1) {
            vec[2] = Math.sqrt(1 * 1 - OP_squared);  // Pythagore
        }
        else {
           // vec3.normalize(vec, vec);  // nearest point
        }

        return vec;
    }

    Input.prototype.CalculateMoveMatrix = function(pointA, pointB){
        var result = mat4.create();
        if(pointA.x == pointB.x && pointA.y == pointB.y){
            return result;
        }

        var a = this.GetArcballVector(pointA.x, pointA.y);
        var b = this.GetArcballVector(pointB.x, pointB.y);

        /* Y Axis Rotation (Movement on x axis) */
        var aY = vec3.fromValues(a[0], 0, a[2]);
        var bY = vec3.fromValues(b[0], 0, b[2]);
        vec3.normalize(aY, aY); vec3.normalize(bY, bY);

        /* X Axis Rotation (Movement on y axis) */
        var aX = vec3.fromValues(0, a[1], a[2]);
        var bX = vec3.fromValues(0, b[1], b[2]);
        vec3.normalize(aX, aX); vec3.normalize(bX, bX);

        /* Y Angle and Axis */
        var yAngle = Math.acos(Math.min(1.0, vec3.dot(aY, bY)));
        var yAxis = vec3.create();
        vec3.cross(yAxis, aY, bY);

        /* X Angle and Axis */
        var angle = Math.acos(Math.min(1.0, vec3.dot(aX, bX)));
        var axis = vec3.create();
        vec3.cross(axis, aX, bX);

        /* Invert the current camera matrix */
        var inv = mat4.create();
        mat4.invert(inv, this.camera.matrix);

        /* Rotate around x axis (transformed by inverse camera matrix */
        vec3.transformMat4(axis, axis, inv);
        mat4.rotate(result, result, angle, axis);

        /* transform y axis in x-axis rotated space*/
        vec3.transformMat4(yAxis, yAxis, result);
        /* Rotate around y axis */
        mat4.rotate(result, result, yAngle, yAxis);

        return result;
    }

    return Input;
})