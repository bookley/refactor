import MousePosition = require("input/mousePosition");
import ArcballBehaviour = require("camera/behaviours/arcballBehaviour");
import CameraClickBehaviour = require("camera/behaviours/clickBehaviour");
import Camera = require("camera/camera");

export class Input {

    previousMouse:MousePosition.MousePosition;
    currentMouse:MousePosition.MousePosition;
    currentClientMouse:MousePosition.MousePosition;

    isLeftMouseDown:boolean;
    isMiddleMouseDown:boolean;

    cameraBehaviour:ArcballBehaviour.Arcball;
    cameraClickBehaviour:CameraClickBehaviour.CameraClickBehaviour;
    camera:Camera.Camera;
    element:HTMLElement;

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
    }

    ControlCamera(camera){
        this.camera = camera;
    }

    setOnCameraClickBehaviour(cameraClickBehaviour){
        this.cameraClickBehaviour = cameraClickBehaviour;
    }

    OnMouseMove(evt){
        this.currentMouse = new MousePosition.MousePosition(evt.x, evt.y);
        this.currentClientMouse = new MousePosition.MousePosition(evt.pageX - this.element.offsetLeft, evt.pageY - this.element.offsetTop);
        if(!this.previousMouse) this.previousMouse = this.currentMouse;
    }

    onClick():void {
        this.cameraClickBehaviour.onClick(this.currentClientMouse);
    }

    Update(){
        if(!this.previousMouse || !this.currentMouse){
            return;
        }

        if(this.isMiddleMouseDown) {
            this.camera.matrix = this.cameraBehaviour.CalculateMoveMatrix(this.previousMouse, this.currentMouse);
        }
        this.previousMouse = this.currentMouse;
    }
}