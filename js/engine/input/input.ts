import MousePosition = require("input/mousePosition");
import ArcballBehaviour = require("camera/behaviours/arcballBehaviour");
import CameraClickBehaviour = require("camera/behaviours/clickBehaviour");
import Camera = require("camera/camera");

export interface MouseMoveListener {
    onMouseMove(fromX, fromY, toX, toY);
}

export interface MouseRayListener {

}

export interface MouseClickListener {
    onMouseClick(x, y);
}

export interface KeyDownListener {
    onKeyDown(keyCode);
}

export interface KeyUpListener {
    onKeyUp(keyCode);
}

export class InputListener {
    previousMouse:MousePosition;
    currentMouse:MousePosition;
    currentClientMouse:MousePosition;

    isLeftMouseDown:boolean;
    isMiddleMouseDown:boolean;

    cameraBehaviour:ArcballBehaviour.Arcball;
    cameraClickBehaviour:CameraClickBehaviour.CameraClickBehaviour;
    camera:Camera.Camera;
    element:HTMLElement;

    private mouseMoveListener:MouseMoveListener;
    private mouseClickListener:MouseClickListener;
    private keyDownListener:KeyDownListener;
    private keyUpListener:KeyUpListener;
    private mouseRayListener:MouseRayListener;

    constructor(element) {
        var self = this;

        this.previousMouse = null;
        this.currentMouse = null;

        this.isLeftMouseDown = false;
        this.isMiddleMouseDown = false;

        this.cameraBehaviour = new ArcballBehaviour.Arcball();
        this.element = element;

        element.onmousemove =  function(evt){
            self.OnMouseMove(evt);
        }

        element.onmousedown = function(evt){
            switch(evt.which){
                case 1:
                    self.isLeftMouseDown = true;
                    break;
                case 2:
                    self.isMiddleMouseDown = true;
                    break;
            }
        }

        document.onmouseup = function(evt){
            switch(evt.which){
                case 1:
                    self.isLeftMouseDown = false;
                    self.onClick();
                    break;
                case 2:
                    self.isMiddleMouseDown = false;
                    break;
            }
        }

        document.onkeydown = function(evt){
            if(evt.keyCode == 87){
                self.isMiddleMouseDown = true;
            }
        }

        document.onkeyup = function(evt){
            if(evt.keyCode == 87){
                self.isMiddleMouseDown = false;
            }
        }
    }

    setMouseMoveListener(listener:MouseMoveListener){
        this.mouseMoveListener = listener;
    }

    setMouseClickListener(listener:MouseClickListener){
        this.mouseClickListener = listener;
    }

    setMouseRayListener(listener:MouseRayListener){
        this.mouseRayListener = listener;
    }

    setKeyDownListener(listener:KeyDownListener){
        this.keyDownListener = listener;
    }

    setKeyUpListener(listener:KeyUpListener){
        this.keyUpListener = listener;
    }

    ControlCamera(camera){
        this.camera = camera;
    }

    setOnCameraClickBehaviour(cameraClickBehaviour){
        this.cameraClickBehaviour = cameraClickBehaviour;
    }

    OnMouseMove(evt){
        this.currentMouse = new MousePosition(evt.x, evt.y);
        this.currentClientMouse = new MousePosition(evt.pageX - this.element.offsetLeft, evt.pageY - this.element.offsetTop);
        if(!this.previousMouse) this.previousMouse = this.currentMouse;

        if(this.mouseMoveListener)
            this.mouseMoveListener.onMouseMove(this.previousMouse.x, this.previousMouse.y, this.currentClientMouse.x, this.currentClientMouse.y);
    }

    onClick():void {
        this.cameraClickBehaviour.onClick(this.currentClientMouse);
        if(this.mouseClickListener)
            this.mouseClickListener.onMouseClick(this.currentClientMouse.x, this.currentClientMouse.y);

    }

    Update(){
        if(!this.previousMouse || !this.currentMouse){
            return;
        }

        if(this.isMiddleMouseDown) {
            this.camera.setMatrix(this.cameraBehaviour.CalculateMoveMatrix(this.previousMouse, this.currentMouse));
        }
        this.previousMouse = this.currentMouse;
    }
}