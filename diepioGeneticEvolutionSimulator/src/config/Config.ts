import TankLevels from "../game/entities/tank/TankLevels";

class Config {
    public initalTanks: number = 192;
    public maintainTanks: number = 64;
    public targetEntities: number = 6400;
    public size: number = 24000;

    public spawnRates = {
        square: 5,
        triangle: 3,
        pentagon: 2
    };

    public player = {
        beInTheGame: false,
        level: TankLevels.maxLevel,

        build: {
            healthRegeneration: 36,
            maxHealth: 36,
            bodyDamage: 36,
            bulletSpeed: 7,
            bulletPenetration: 36,
            bulletDamage: 36,
            reload: 10,
            movementSpeed: 36
        }
    }

    public debug = {
        drawHitCircles: false,
        drawQuadTree: false
    }
}

export default Config;