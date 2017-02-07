
import {MousePosition} from "./mousePosition";
import {CameraClickBehaviour} from "../camera/behaviours/clickBehaviour";
import {Camera} from "../camera/camera";
import {MouseHandler, MouseMoveEvent, MouseDownEvent, MouseScrollEvent} from "./inputHandlers/mouseHandler";

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

    cameraClickBehaviour:CameraClickBehaviour;
    camera:Camera;
    element:HTMLElement;

    private mouseHandlers: MouseHandler[];

    constructor(element) {
        var self = this;

        this.previousMouse = null;
        this.currentMouse = null;

        this.isLeftMouseDown = false;
        this.isMiddleMouseDown = false;
        this.element = element;

        this.mouseHandlers = [];

        element.onmousemove =  function(evt){
            self.onMouseMove(evt);
        }

        element.onmousedown = (evt) => {
            if(this.mouseHandlers != null && this.mouseHandlers.length){
                this.mouseHandlers.forEach((mh) => mh.onMouseDown(new MouseDownEvent(evt.which, evt.x, evt.y)));
            }

            switch(evt.which){
                case 1:
                    self.isLeftMouseDown = true;
                    break;
                case 2:
                    self.isMiddleMouseDown = true;
                    break;
            }
        }

        document.onmouseup = (evt) => {
            if(this.mouseHandlers != null && this.mouseHandlers.length){
                this.mouseHandlers.forEach((mh) => mh.onMouseUp(new MouseDownEvent(evt.which, evt.x, evt.y)));
            }

            switch(evt.which){
                case 1:
                    self.isLeftMouseDown = false;
                    self.onClick(evt);
                    break;
                case 2:
                    self.isMiddleMouseDown = false;
                    break;
            }
        }

        document.onmousewheel = (evt) => {
            if(this.mouseHandlers != null && this.mouseHandlers.length){
                this.mouseHandlers.forEach((mh) => mh.onMouseScroll(new MouseScrollEvent(evt.wheelDelta)));
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

    setOnCameraClickBehaviour(cameraClickBehaviour){
        this.cameraClickBehaviour = cameraClickBehaviour;
    }

    onMouseMove(evt){
        this.currentMouse = new MousePosition(evt.x, evt.y);
        this.currentClientMouse = new MousePosition(evt.pageX - this.element.offsetLeft, evt.pageY - this.element.offsetTop);
        if(!this.previousMouse) this.previousMouse = this.currentMouse;

        if(this.mouseHandlers != null && this.mouseHandlers.length){
            this.mouseHandlers.forEach((mh) => mh.onMouseMove(new MouseMoveEvent(this.previousMouse.x, this.previousMouse.y, this.currentMouse.x, this.currentMouse.y)));
        }
    }

    onClick(evt):void {
        this.cameraClickBehaviour.onClick(this.currentClientMouse);
    }

    update(){
        if(!this.previousMouse || !this.currentMouse){
            return;
        }

        this.previousMouse = this.currentMouse;
    }

    addMouseHandler(handler: MouseHandler) {
        this.mouseHandlers.push(handler);
    }
}