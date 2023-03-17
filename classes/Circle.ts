import { GameObject } from "./GameObject";

export class Circle extends GameObject {

    constructor (context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, vx: number, vy: number, type: string) {
        super(context, x, y, width, height, vx, vy, type);
    }

    draw() {
        // Draw a simple square
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI, false);
        this.context.fillStyle = this.isColliding ? 'red' : 'green';
        this.context.fill();
    }
}