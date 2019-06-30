import Entity from "../Entity";

export default function circleCircleElasticCollision(a: Entity, b: Entity): void {
    const contactAngle = Math.atan2(a.y - b.y, a.x - b.x);
    const contactX = Math.cos(contactAngle);
    const contactY = Math.sin(contactAngle);
    const perpContactX = Math.cos(contactAngle + Math.PI / 2);
    const perpContactY = Math.sin(contactAngle + Math.PI / 2);

    const betweenX = (a.x + b.x) / 2;
    const betweenY = (a.y + b.y) / 2;
    const averageRadius = (a.radius + b.radius) / 2;
    const cdx = contactX * averageRadius;
    const cdy = contactY * averageRadius;
    a.x = betweenX + cdx;
    a.y = betweenY + cdy;
    b.x = betweenX - cdx;
    b.y = betweenY - cdy;

    const velocityA = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
    const velocityB = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
    const directionA = Math.atan2(a.vy, a.vx);
    const directionB = Math.atan2(b.vy, b.vx);

    const dDirectionBContactAngleX = Math.cos(directionB - contactAngle);
    const dDirectionAContactAngleX = Math.cos(directionA - contactAngle);

    const temp11 = (velocityA * dDirectionAContactAngleX * (a.radius - b.radius) + 2 * b.radius * velocityB * dDirectionBContactAngleX) / (a.radius + b.radius);
    const temp12 = velocityA * Math.sin(directionA - contactAngle);
    const temp21 = (velocityB * dDirectionBContactAngleX * (b.radius - a.radius) + 2 * a.radius * velocityA * dDirectionAContactAngleX) / (a.radius + b.radius);
    const temp22 = velocityB * Math.sin(directionB - contactAngle);

    a.vx = temp11 * contactX + temp12 * perpContactX;
    a.vy = temp11 * contactY + temp12 * perpContactY;
    b.vx = temp21 * contactX + temp22 * perpContactX;
    b.vy = temp21 * contactY + temp22 * perpContactY;
}