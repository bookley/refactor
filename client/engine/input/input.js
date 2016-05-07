define(["require", "exports", "input/mousePosition", "camera/behaviours/arcballBehaviour"], function (require, exports, MousePosition, ArcballBehaviour) {
    var InputListener = (function () {
        function InputListener(element) {
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
            document.onkeydown = function (evt) {
                if (evt.keyCode == 87) {
                    self.isMiddleMouseDown = true;
                }
            };
            document.onkeyup = function (evt) {
                if (evt.keyCode == 87) {
                    self.isMiddleMouseDown = false;
                }
            };
        }
        InputListener.prototype.setMouseMoveListener = function (listener) {
            this.mouseMoveListener = listener;
        };
        InputListener.prototype.setMouseClickListener = function (listener) {
            this.mouseClickListener = listener;
        };
        InputListener.prototype.setMouseRayListener = function (listener) {
            this.mouseRayListener = listener;
        };
        InputListener.prototype.setKeyDownListener = function (listener) {
            this.keyDownListener = listener;
        };
        InputListener.prototype.setKeyUpListener = function (listener) {
            this.keyUpListener = listener;
        };
        InputListener.prototype.ControlCamera = function (camera) {
            this.camera = camera;
        };
        InputListener.prototype.setOnCameraClickBehaviour = function (cameraClickBehaviour) {
            this.cameraClickBehaviour = cameraClickBehaviour;
        };
        InputListener.prototype.OnMouseMove = function (evt) {
            this.currentMouse = new MousePosition(evt.x, evt.y);
            this.currentClientMouse = new MousePosition(evt.pageX - this.element.offsetLeft, evt.pageY - this.element.offsetTop);
            if (!this.previousMouse)
                this.previousMouse = this.currentMouse;
            if (this.mouseMoveListener)
                this.mouseMoveListener.onMouseMove(this.previousMouse.x, this.previousMouse.y, this.currentClientMouse.x, this.currentClientMouse.y);
        };
        InputListener.prototype.onClick = function () {
            this.cameraClickBehaviour.onClick(this.currentClientMouse);
            if (this.mouseClickListener)
                this.mouseClickListener.onMouseClick(this.currentClientMouse.x, this.currentClientMouse.y);
        };
        InputListener.prototype.Update = function () {
            if (!this.previousMouse || !this.currentMouse) {
                return;
            }
            if (this.isMiddleMouseDown) {
                this.camera.setMatrix(this.cameraBehaviour.CalculateMoveMatrix(this.previousMouse, this.currentMouse));
            }
            this.previousMouse = this.currentMouse;
        };
        return InputListener;
    })();
    exports.InputListener = InputListener;
});
//# sourceMappingURL=input.client.map