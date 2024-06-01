const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

// Point class for calculating midpoint distance.
export default class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    getNextPoint(p: Point, r: number): Point {
        let dx = Math.abs(p.x - this.x) * r;
        let dy = Math.abs(p.y - this.y) * r;

        if (this.x > p.x) dx *= -1;
        if (this.y > p.y) dy *= -1

        return new Point(this.x + dx, this.y + dy);
    }

    drawPoint() {
        ctx.fillStyle = "rgba(255, 0, 0)";
        ctx.fillRect(this.x, this.y, 1, 1);
        ctx.fillStyle = "black";
    }
}