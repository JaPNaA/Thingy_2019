type LevelUpHandler = () => void;

class TankLevels {
    public static readonly maxLevel = 55;
    public static requiredForLevel: number[];
    public totalXP: number;
    public level: number;

    private levelUpHandlers: LevelUpHandler[];

    constructor() {
        this.totalXP = 0;
        this.level = 1;
        this.levelUpHandlers = [];
    }

    public addXP(xp: number): void {
        this.totalXP += xp;

        while (this.totalXP >= TankLevels.requiredForLevel[this.level + 1]) {
            this.level++;
            this.dispatchLevelUp();
        }
    }

    public reset(): void {
        this.level = 1;
        this.totalXP = 0;
    }

    public onLevelUp(handler: LevelUpHandler): void {
        this.levelUpHandlers.push(handler);
    }

    public dispatchLevelUp(): void {
        for (const levelUpHandler of this.levelUpHandlers) {
            levelUpHandler();
        }
    }
}

TankLevels.requiredForLevel = [];

for (let i = 0; i <= TankLevels.maxLevel; i++) {
    TankLevels.requiredForLevel[i] =
        0.5 * (i ** (0.055 * i))
        + 1.3 * (i ** 2.50)
        - 1.8;
    // console.log(TankLevels);
}

export default TankLevels;