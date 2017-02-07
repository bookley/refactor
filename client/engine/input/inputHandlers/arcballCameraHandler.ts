
import {MouseHandler, MouseMoveEvent, MouseUpEvent, MouseScrollEvent} from "./mouseHandler";
import {ArcballCamera} from "../../camera/camera";
import {vec3} from "gl-matrix";

export class ArcballCameraHandler implements MouseHandler {

    private _camera: ArcballCamera;
    private _enabled: boolean;

    constructor(camera: ArcballCamera){
        this._camera = camera;
    }

    setEnabled(enabled: boolean): void {
        this._enabled = enabled;
    }

    onMouseMove(evt: MouseMoveEvent): void {
        if(!this._enabled) return;

        let previousVector = this.getArcballVector(evt.previousX, evt.previousY);
        let nextVector = this.getArcballVector(evt.x, evt.y);

        let xAngle = this.dotFromVectors(vec3.fromValues(previousVector[0], 0, previousVector[2]),
            vec3.fromValues(nextVector[0], 0, nextVector[2]));
        this._camera.alpha += (nextVector[0] - previousVector[0] < 0)? -xAngle : xAngle;

        let yAngle = this.dotFromVectors(vec3.fromValues(0, previousVector[1], previousVector[2]),
            vec3.fromValues(0, nextVector[1], nextVector[2]));
        this._camera.beta += (nextVector[1] - previousVector[1] < 0)? yAngle : -yAngle;

        //todo: clamping - this should be game specific
        if(this._camera.beta < 0.2) this._camera.beta = 0.2;
        if(this._camera.beta > 0.9) this._camera.beta = 0.9;
    }

    onMouseDown(evt: MouseUpEvent): void {
        if(evt.key == 2)
            this._enabled = true;
    }

    onMouseUp(evt: MouseUpEvent): void {
        if(evt.key == 2)
            this._enabled = false;
    }

    onMouseScroll(evt: MouseScrollEvent): void {
        this._camera.radius += evt.delta * -0.001;
    }

    private dotFromVectors(a: vec3, b: vec3): number {
        vec3.normalize(a, a);
        vec3.normalize(b, b);
        return Math.acos(Math.min(1.0, vec3.dot(a, b)));
    }

    private getArcballVector(x: number, y: number): vec3 {
        let vec = vec3.fromValues(x / this._camera.width * 2 - 1, y / this._camera.height * 2 - 1, 0);
        vec[1] *= -1;

        let square = vec[0] * vec[0] + vec[1] * vec[1];
        if (square <= 1     ) {
            vec[2] = Math.sqrt(1 - square);
        }

        return vec;
    }
}
