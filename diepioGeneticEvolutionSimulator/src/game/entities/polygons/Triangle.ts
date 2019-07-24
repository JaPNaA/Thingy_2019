import Polygon from "../Polygon";

class Triangle extends Polygon {
    public radius: number = 15;
    public health: number = 6;
    public xpValue: number = 20;

    private static renderedRadius: number = 20;
    private static points = [
        [Math.cos(Math.PI * 2 / 3) * Triangle.renderedRadius, Math.sin(Math.PI * 2 / 3) * Triangle.renderedRadius],
        [Math.cos(Math.PI * 4 / 3) * Triangle.renderedRadius, Math.sin(Math.PI * 4 / 3) * Triangle.renderedRadius],
        [Math.cos(Math.PI * 6 / 3) * Triangle.renderedRadius, Math.sin(Math.PI * 6 / 3) * Triangle.renderedRadius]
    ];

    public render(X: CanvasRenderingContext2D, now: number): void {
        this.rotation = this.initalRotation + this.vrotation * now;

        X.translate(this.x, this.y);
        X.rotate(this.rotation);
        X.beginPath();
        X.fillStyle = "#f86e73";
        X.strokeStyle = "#b65256";
        X.lineWidth = 3;
        X.lineJoin = "round";
        X.moveTo(Triangle.points[0][0], Triangle.points[0][1]);
        X.lineTo(Triangle.points[1][0], Triangle.points[1][1]);
        X.lineTo(Triangle.points[2][0], Triangle.points[2][1]);
        X.closePath();
        X.fill();
        X.stroke();
    }
}

export default Triangle;