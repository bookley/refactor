
export class MouseMoveEvent {
    public readonly previousX: number;
    public readonly previousY: number;

    public readonly x: number;
    public readonly y: number;

    constructor(previousX: number, previousY: number, x: number, y: number){
        this.previousX = previousX;
        this.previousY = previousY;
        this.x = x;
        this.y = y;
    }
}

export class MouseDownEvent {
    public readonly key: number;
    public readonly x: number;
    public readonly y: number;

    constructor(key: number, x: number, y: number){
        this.key = key;
        this.x = x;
        this.y = y;
    }
}

export class MouseUpEvent {
    public readonly key: number;
}

export class MouseScrollEvent {

    constructor(delta: number){
        this.delta = delta;
    }

    public readonly delta: number;
}

export interface MouseHandler {
    onMouseMove(evt: MouseMoveEvent): void;
    onMouseDown(evt: MouseUpEvent): void;
    onMouseUp(evt: MouseUpEvent): void;
    onMouseScroll(evt: MouseScrollEvent): void;
}