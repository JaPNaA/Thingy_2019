import Polygon from "../Polygon";

class Square extends Polygon {
    public radius: number = 18;
    public health: number = 2;
    public xpValue: number = 4;

    private static renderRadius = 16;

    public render(X: CanvasRenderingContext2D): void {
        X.translate(this.x, this.y);
        X.rotate(this.rotation);
        X.beginPath();
        X.fillStyle = "#f2ec2e";
        X.strokeStyle = "#888888";
        X.rect(-Square.renderRadius, -Square.renderRadius, Square.renderRadius * 2, Square.renderRadius * 2);
        X.fill();
        X.stroke();
    }
}

export default Square;