import Polygon from "../Polygon";

class Square extends Polygon {
    public radius: number = 17;
    public health: number = 2;
    public xpValue: number = 4;

    private static renderRadius = 14;

    public render(X: CanvasRenderingContext2D): void {
        X.translate(this.x, this.y);
        X.rotate(this.rotation);
        X.beginPath();
        X.fillStyle = "#fee468";
        X.strokeStyle = "#baa84d";
        X.lineWidth = 3;
        X.lineJoin = "round";
        X.rect(-Square.renderRadius, -Square.renderRadius, Square.renderRadius * 2, Square.renderRadius * 2);
        X.fill();
        X.stroke();
    }
}

export default Square;