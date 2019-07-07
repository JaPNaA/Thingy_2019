import Genes from "./Genes";

class TankBuild {
    public static readonly max = 7;
    public static readonly keys: (keyof TankBuild & keyof Genes)[] = [
        "healthRegeneration", "maxHealth", "bodyDamage",
        "bulletSpeed", "bulletPenetration", "bulletDamage",
        "reload", "movementSpeed"
    ];

    public healthRegeneration: number = 0; // todo: not implemented
    public maxHealth: number = 0; // todo: not implemented
    public bodyDamage: number = 0; // todo: not implemented
    public bulletSpeed: number = 0;
    public bulletPenetration: number = 0;
    public bulletDamage: number = 0;
    public reload: number = 0;
    public movementSpeed: number = 0;

    /**
     * @returns successful?
     */
    public static upgrade(build: TankBuild, key: keyof TankBuild): boolean {
        if (build[key] >= TankBuild.max) {
            return false;
        } else {
            build[key]++;
            return true;
        }
    }
}

export default TankBuild;