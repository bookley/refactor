export class MousePos {
    x:number;
    y:number;

    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }
}

import ArcballBehaviour = require("camera/arcballBehaviour");
import Camera = require("camera/camera");

export class Input {

    previousMouse:MousePos;
    currentMouse:MousePos;
    isMouseDown:boolean;
    cameraBehaviour:ArcballBehaviour.Arcball;
    camera:Camera.Camera;

    constructor(element) {
        var self = this;

        this.previousMouse = null;
        this.currentMouse = null;
        this.isMouseDown = false;

        this.cameraBehaviour = new ArcballBehaviour.Arcball();

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

    ControlCamera(camera){
        this.camera = camera;
    }

    OnMouseMove(evt){
        this.currentMouse = {
            x: evt.x,
            y: evt.y
        };

        if(!this.previousMouse) this.previousMouse = this.currentMouse;
    }

    Update(){
        if(!this.previousMouse || !this.currentMouse){
            return;
        }

        if(this.isMouseDown) {
            this.camera.matrix = this.cameraBehaviour.CalculateMoveMatrix(this.previousMouse, this.currentMouse);
        }
        this.previousMouse = this.currentMouse;
    }
}