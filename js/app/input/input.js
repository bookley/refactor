define(["require", "exports", "input/mousePosition", "camera/behaviours/arcballBehaviour"], function (require, exports, MousePosition, ArcballBehaviour) {
    var Input = (function () {
        function Input(element) {
            var self = this;
            this.previousMouse = null;
            this.currentMouse = null;
            this.isLeftMouseDown = false;
            this.isMiddleMouseDown = false;
            this.cameraBehaviour = new ArcballBehaviour.Arcball();
            this.element = element;
            element.onmousemove = function (evt) {
                self.OnMouseMove(evt);
            };
            element.onmousedown = function (evt) {
                switch (evt.which) {
                    case 1:
                        self.isLeftMouseDown = true;
                        break;
                    case 2:
                        self.isMiddleMouseDown = true;
                        break;
                }
            };
            document.onmouseup = function (evt) {
                switch (evt.which) {
                    case 1:
                        self.isLeftMouseDown = false;
                        self.onClick();
                        break;
                    case 2:
                        self.isMiddleMouseDown = false;
                        break;
                }
            };
        }
        Input.prototype.ControlCamera = function (camera) {
            this.camera = camera;
        };
        Input.prototype.setOnCameraClickBehaviour = function (cameraClickBehaviour) {
            this.cameraClickBehaviour = cameraClickBehaviour;
        };
        Input.prototype.OnMouseMove = function (evt) {
            this.currentMouse = new MousePosition(evt.x, evt.y);
            this.currentClientMouse = new MousePosition(evt.pageX - this.element.offsetLeft, evt.pageY - this.element.offsetTop);
            if (!this.previousMouse)
                this.previousMouse = this.currentMouse;
        };
        Input.prototype.onClick = function () {
            this.cameraClickBehaviour.onClick(this.currentClientMouse);
        };
        Input.prototype.Update = function () {
            if (!this.previousMouse || !this.currentMouse) {
                return;
            }
            if (this.isMiddleMouseDown) {
                this.camera.matrix = this.cameraBehaviour.CalculateMoveMatrix(this.previousMouse, this.currentMouse);
            }
            this.previousMouse = this.currentMouse;
        };
        return Input;
    })();
    return Input;
});
//# sourceMappingURL=input.js.map