import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect } from 'react'
import { Player } from '@/classes/Player'
import { GameObject } from '@/classes/GameObject'
import { Ball } from '@/classes/Ball'

const inter = Inter({ subsets: ['latin'] })

let oldTimeStamp = 0;

const gameObjects: GameObject[] = [];

interface Game {
    canvas: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
}

export interface VelocityChange {
    x: -1 | 0 | 1;
    y: -1 | 0 | 1;
}

interface Keys {
    W: boolean;
    A: boolean;
    S: boolean;
    D: boolean;
}

const game: Game = {
    canvas: null,
    context: null
}

const keys: Keys = {
    W: false,
    A: false,
    S: false,
    D: false,
};




export default function Home() {

    useEffect(() => {

        if (game.canvas) return;

        game.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        
        if (game.canvas) {
            game.context = game.canvas.getContext("2d");
            if (game.context) {
                const player = new Player(game.context, 500, 500, 50, 50, 0, 0);
                gameObjects.push(player);

                const ball = new Ball(game.context, 600, 500, 50, 50, 0, 0);
                gameObjects.push(ball);
                gameLoop(1);
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const rectIntersect = (
        x1: number,
        y1: number,
        w1: number,
        h1: number,
        x2: number,
        y2: number,
        w2: number,
        h2: number
    ) => {
        // Check x and y for overlap
        if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
            return false;
        }
        return true;
    }

    const circleIntersect = (
        x1: number,
        y1: number,
        r1: number,
        x2: number,
        y2: number,
        r2: number,
    ) => {

        // Calculate the distance between the two circles
        let squareDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
    
        // When the distance is smaller or equal to the sum
        // of the two radius, the circles touch or overlap
        return squareDistance <= ((r1 + r2) * (r1 + r2))
    }

    // Define the edges of the canvas
    const canvasWidth = 1280;
    const canvasHeight = 720;
    const fieldWidth = 1115;
    const fieldHeight = 610;
    const fieldWDiff = canvasWidth - fieldWidth;
    const fieldHDiff = canvasHeight - fieldHeight;
    // Set a restitution, a lower value will lose more energy when colliding
    const restitution = 1;

    const detectEdgeCollisions = () => {
        let obj;
        for (let i = 0; i < gameObjects.length; i++) {
            obj = gameObjects[i];

            // Check for left and right
            if (obj.x < (fieldWDiff / 2) + (obj.width / 2)) {
                obj.vx = Math.abs(obj.vx) * restitution;
                obj.x = (fieldWDiff / 2) + (obj.width / 2);
            } else if (obj.x > canvasWidth - (fieldWDiff / 2) - (obj.width / 2)) {
                obj.vx = -Math.abs(obj.vx) * restitution;
                obj.x = canvasWidth - (fieldWDiff / 2) - (obj.width / 2);
            }

            // Check for bottom and top
            if (obj.y < (fieldHDiff / 2) + (obj.width / 2)) {
                obj.vy = Math.abs(obj.vy) * restitution;
                obj.y = (fieldHDiff / 2) + (obj.width / 2);
            } else if (obj.y > canvasHeight - (fieldHDiff / 2) - (obj.width / 2)) {
                obj.vy = -Math.abs(obj.vy) * restitution;
                obj.y = canvasHeight - (fieldHDiff / 2) - (obj.width / 2);
            }
        }
    }

    const detectCollisions = () => {
        let obj1;
        let obj2;
    
        // Reset collision state of all objects
        for (let i = 0; i < gameObjects.length; i++) {
            gameObjects[i].isColliding = false;
        }
    
        // Start checking for collisions
        for (let i = 0; i < gameObjects.length; i++) {
            obj1 = gameObjects[i];
            for (let j = i + 1; j < gameObjects.length; j++) {
                obj2 = gameObjects[j];
    
                // Compare object1 with object2
                if (circleIntersect(obj1.x, obj1.y, obj1.width / 2, obj2.x, obj2.y, obj2.width / 2)){
                    obj1.isColliding = true;
                    obj2.isColliding = true;

                    let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                    let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
                    let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                    let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
                    if (speed < 0){
                        break;
                    }
                    // obj1.vx -= (speed * vCollisionNorm.x);
                    // obj1.vy -= (speed * vCollisionNorm.y);
                    obj2.vx += (speed * vCollisionNorm.x);
                    obj2.vy += (speed * vCollisionNorm.y);
                }
            }
        }
    }

    const velocityFromKeys = (): VelocityChange => {
        let x: -1 | 0 | 1 = 0;
        let y: -1 | 0 | 1 = 0;
        if (keys.W) {
            y = -1;
        }
        if (keys.A) {
            x = -1;
        }
        if (keys.S) {
            y = 1;
        }
        if (keys.D) {
            x = 1;
        }
        return {
            x,
            y
        }
    }

    const clearCanvas = () => {
        if (game.context && game.canvas) {
            game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
            // game.context.drawImage(image, dx, dy, dWidth, dHeight)
        }
    }

    const gameLoop = (timeStamp: number) => {
        const secondsPassed = (timeStamp - oldTimeStamp) / 1000;
        oldTimeStamp = timeStamp;

        // Loop over all game objects
        for (let i = 0; i < gameObjects.length; i++) {
            if (gameObjects[i].type === 'player') {
                gameObjects[i].update(secondsPassed, velocityFromKeys());
            } else {
                gameObjects[i].update(secondsPassed);
            }
        }

        clearCanvas();

        // Do the same to draw
        for (let i = 0; i < gameObjects.length; i++) {
            gameObjects[i].draw();
        }

        detectCollisions();
        detectEdgeCollisions();

        window.requestAnimationFrame(gameLoop);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'KeyW':
                keys.W = true;
                break;
            case 'KeyA':
                keys.A = true;
                break;
            case 'KeyS':
                keys.S = true;
                break;
            case 'KeyD':
                keys.D = true;
                break;
        }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'KeyW':
                keys.W = false;
                break;
            case 'KeyA':
                keys.A = false;
                break;
            case 'KeyS':
                keys.S = false;
                break;
            case 'KeyD':
                keys.D = false;
                break;
        }
    }

    return (
        <>
            <Head>
                <title>X League</title>
                <meta name="description" content="x league" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <Image src="/field.jpg" width="1280" height="720" alt="field" style={{position: 'absolute'}} />
                <canvas width="1280" height="720" id="canvas" style={{position: 'absolute', zIndex: 10}} />
            </main>
        </>
    )
}
