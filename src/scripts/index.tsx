import "../css/style.css";
import Point from "./Point";

import React from "react";
import { createRoot } from "react-dom/client";

// Fetches the canvas from the webpage.
const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const cw = canvas.width;
const ch = canvas.height;

// The value of the radius for changing the circle and point boundaries.
const radius = 350;

let f: NodeJS.Timeout;

// Changing variables for generating different fractals.
let SIDES = 5;
let R_VALUE = 0.618;
let USE_DEFAULT = false;
let SELECTION_DELAY = 0; 

/**
 * Creates a new Settings box for adjusting the generation of the fractal.
 * @returns 
 */
function Settings(): JSX.Element {
    return (
        <div className="container">
            <div>
                <p>Number of Sides: </p>
                <input type="number" min="2" onChange={(e) => {
                    SIDES = parseInt(e.target.value);
                }}></input>
            </div>
            <div>
                <p>r: </p>
                <input type="number" onChange={(e) => {
                    R_VALUE = parseFloat(e.target.value);
                }}></input>
                <p>Default?</p>
                <input type="checkbox" style={{width: "5%"}} onChange={(e) => {
                    USE_DEFAULT = e.target.checked;
                }}></input>
            </div>
            <div>
                <p>Selection delay: </p>
                <input type="number" onChange={(e) => {
                    SELECTION_DELAY = parseInt(e.target.value);
                }}></input>
            </div>
            <button onClick={() => {
                clearInterval(f);
                generateChaosGame();
            }}>Run</button>
        </div>
    )
}

/**
 * Calculates the optimal ratio between two points in order to create perfect
 * fractal polygons.
 * 
 * @param s - The amount of sides of the polygon.
 * @returns - The optimal ratio between the distance of two points.
 */
function calculateOptimalR(s: number) {
    const k = Math.round((s + 2) / 4);
    const num = Math.sin(((2 * k - 1) * Math.PI) / s);
    const denom = Math.sin(((2 * k - 1) * Math.PI) / s) + Math.sin(Math.PI / s);

    return num / denom;
}

function generateChaosGame() {
    // Clears the canvas.
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // The path for the circle.
    ctx.beginPath();
    ctx.arc(cw / 2, ch / 2, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath()

    // Generates points to create an N-sided polygon based on the sides value.
    let points: Array<Point> = [];

    for (let i = 0; i < SIDES; i++) {
        let frac = (i * 2 / SIDES) - (1 / (2 * SIDES));
        points.push(new Point(
            cw / 2 + radius * Math.cos(Math.PI * frac),
            ch / 2 + radius * Math.sin(Math.PI * frac),
        ));
    }

    // The initial point for calculations.
    let currentPoint: Point = new Point(cw / 2 + 50, ch / 2 + 50);

    // Draws points using the midpoint calculation of the current point and a randomly
    // chosen point until i hits the limit.

    if (SELECTION_DELAY <= 0) {
        for (let i = 0; i < 200000; i++) {
            currentPoint.drawPoint();
            
            // Selects a random point, finds the midpoint, and then sets the current point to the midpoint.
            let randomPoint: Point = points[Math.floor(Math.random() * points.length)];
            let midpoint = currentPoint.getNextPoint(randomPoint, USE_DEFAULT ? calculateOptimalR(SIDES) : R_VALUE);
            currentPoint = midpoint;
        }
    } else {
        let i = 0;
        let limit = 200000;

        f = setInterval(() => {
            if (i > limit) clearInterval(f);
    
            currentPoint.drawPoint();
            
            // Selects a random point, finds the midpoint, and then sets the current point to the midpoint.
            let randomPoint: Point = points[Math.floor(Math.random() * points.length)];
            let midpoint = currentPoint.getNextPoint(randomPoint, R_VALUE);
            currentPoint = midpoint;
    
            i++;
        }, 0)
    }
}

// Renders the settings panel on the bottom right of the screen.
const settingsRoot = createRoot(document.getElementById("settings"));
settingsRoot.render(<Settings />);