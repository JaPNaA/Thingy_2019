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
}

export default Config;