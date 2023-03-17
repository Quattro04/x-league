import { VelocityChange } from "@/pages";

export class GameObject {

    context;
    x;
    y;
    width;
    height;
    vx;
    vy;
    maxVeloxity: number = 300;
    type: string = "object";
    isColliding;

    constructor (context: any, x: number, y: number, width: number, height: number, vx: number, vy: number, type: string) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.vx = vx;
        this.vy = vy;
        this.type = type;

        this.isColliding = false;
    }

    draw() {
        // Draw a simple square
        this.context.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    increaseVelocityY(v: number) {
        if (v > 0) {
            if (this.vy < this.maxVeloxity) {
                this.vy += v;
            }
        } else {
            if (this.vy > -this.maxVeloxity) {
                this.vy += v;
            }
        }
    }

    increaseVelocityX(v: number) {
        if (v > 0) {
            if (this.vx < this.maxVeloxity) {
                this.vx += v;
            }
        } else {
            if (this.vx > -this.maxVeloxity) {
                this.vx += v;
            }
        }
    }

    update(secondsPassed: number, velocityChange?: VelocityChange) {
        // Move with set velocity

        // if (keys.W !== undefined) {
        //     if (keys.W) {
        //         this.increaseVelocityY(-this.stepVeloxity)
        //     } else if (this.vy < 0) {
        //         this.increaseVelocityY(this.stepVeloxity)
        //     }
        //     if (keys.A) {
        //         this.increaseVelocityX(-this.stepVeloxity)
        //     } else if (this.vx < 0) {
        //         this.increaseVelocityX(this.stepVeloxity)
        //     }
        //     if (keys.S) {
        //         this.increaseVelocityY(this.stepVeloxity)
        //     } else if (this.vy > 0) {
        //         this.increaseVelocityY(-this.stepVeloxity)
        //     }
        //     if (keys.D) {
        //         this.increaseVelocityX(this.stepVeloxity)
        //     } else if (this.vx > 0) {
        //         this.increaseVelocityX(-this.stepVeloxity)
        //     }
        // }

        if (velocityChange) {
            this.vx = velocityChange.x > 0 ? this.maxVeloxity : (velocityChange.x < 0 ? -this.maxVeloxity : 0)
            this.vy = velocityChange.y > 0 ? this.maxVeloxity : (velocityChange.y < 0 ? -this.maxVeloxity : 0)
        }

        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}