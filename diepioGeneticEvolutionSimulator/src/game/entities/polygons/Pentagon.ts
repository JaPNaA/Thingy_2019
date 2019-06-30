import Polygon from "../Polygon";

class Pentagon extends Polygon {
    public radius: number = 30;
    public health: number = 2;

    private static renderedRadius: number = 32;
    private static points = [
        [Math.cos(Math.PI * 2 / 5) * Pentagon.renderedRadius, Math.sin(Math.PI * 2 / 5) * Pentagon.renderedRadius],
        [Math.cos(Math.PI * 4 / 5) * Pentagon.renderedRadius, Math.sin(Math.PI * 4 / 5) * Pentagon.renderedRadius],
        [Math.cos(Math.PI * 6 / 5) * Pentagon.renderedRadius, Math.sin(Math.PI * 6 / 5) * Pentagon.renderedRadius],
        [Math.cos(Math.PI * 8 / 5) * Pentagon.renderedRadius, Math.sin(Math.PI * 8 / 5) * Pentagon.renderedRadius],
        [Math.cos(Math.PI * 10 / 5) * Pentagon.renderedRadius, Math.sin(Math.PI * 10 / 5) * Pentagon.renderedRadius]
    ];

    public render(X: CanvasRenderingContext2D): void {
        X.translate(this.x, this.y);
        X.rotate(this.rotation);
        X.beginPath();
        X.fillStyle = "#0073ff";
        X.strokeStyle = "#888888";
        X.moveTo(Pentagon.points[0][0], Pentagon.points[0][1]);
        X.lineTo(Pentagon.points[1][0], Pentagon.points[1][1]);
        X.lineTo(Pentagon.points[2][0], Pentagon.points[2][1]);
        X.lineTo(Pentagon.points[3][0], Pentagon.points[3][1]);
        X.lineTo(Pentagon.points[4][0], Pentagon.points[4][1]);
        X.closePath();
        X.fill();
        X.stroke();
    }
}

export default Pentagon;