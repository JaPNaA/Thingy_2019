import TankLevels from "../game/entities/tank/TankLevels";

class Config {
    public initalTanks: number = 96;
    public maintainTanks: number = 32;
    public targetEntities: number = 2400;
    public size: number = 16000;

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
}

export default Config;