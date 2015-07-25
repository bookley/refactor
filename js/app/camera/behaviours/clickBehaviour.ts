import MousePosition = require("input/mousePosition");

export interface CameraClickBehaviour {
  onClick(x:MousePosition);
}