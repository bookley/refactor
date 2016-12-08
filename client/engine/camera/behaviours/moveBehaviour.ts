import {MousePosition} from "../../input/mousePosition";

export interface MoveBehaviour {
    getMatrix(prevMouse:MousePosition, currentMouse:MousePosition):Float32Array;
}