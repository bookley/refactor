define(["require", "exports", "camera/arcballBehaviour"], function (require, exports, ArcballBehaviour) {
    var MousePos = (function () {
        function MousePos(x, y) {
            this.x = x;
            this.y = y;
        }
        return MousePos;
    })();
    exports.MousePos = MousePos;
    var Input = (function () {
        function Input(element) {
            var self = this;
            this.previousMouse = null;
            this.currentMouse = null;
            this.isMouseDown = false;
            this.cameraBehaviour = new ArcballBehaviour.Arcball();
            element.onmousemove = function (evt) {
                self.OnMouseMove(evt);
            };
            element.onmousedown = function (evt) {
                if (evt.which == 1) {
                    self.isMouseDown = true;
                }
            };
            document.onmouseup = function (evt) {
                if (evt.which == 1) {
                    self.isMouseDown = false;
                }
            };
        }
        Input.prototype.ControlCamera = function (camera) {
            this.camera = camera;
        };
        Input.prototype.OnMouseMove = function (evt) {
            this.currentMouse = {
                x: evt.x,
                y: evt.y
            };
            if (!this.previousMouse)
                this.previousMouse = this.currentMouse;
        };
        Input.prototype.Update = function () {
            if (!this.previousMouse || !this.currentMouse) {
                return;
            }
            if (this.isMouseDown) {
                this.camera.matrix = this.cameraBehaviour.CalculateMoveMatrix(this.previousMouse, this.currentMouse);
            }
            this.previousMouse = this.currentMouse;
        };
        return Input;
    })();
    exports.Input = Input;
});
//# sourceMappingURL=Input.js.map