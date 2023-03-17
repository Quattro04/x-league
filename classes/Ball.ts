import { Circle } from "./Circle";

export class Ball extends Circle {

    constructor (context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, vx: number, vy: number) {
        super(context, x, y, width, height, vx, vy, 'ball');
    }
}