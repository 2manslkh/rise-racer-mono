import { Part, PartType } from "./type";

// Initial parts data based on the smart contract values
export const initialPartsData: Part[] = [
    {
        id: "engine-1",
        type: PartType.ENGINE,
        name: "Engine",
        currentLevel: 1,
        upgradeCost: 100, // ENGINE_BASE_COST from contract
        imageUrl: "/images/parts/engine.png",
        baseVelocity: 5,  // ENGINE_BASE_VELOCITY from contract
        velocityMultiplier: 1.2, // ENGINE_GROWTH_FACTOR from contract (1.20)
    },
    {
        id: "turbo-1",
        type: PartType.TURBO,
        name: "Turbo",
        currentLevel: 1,
        upgradeCost: 500, // TURBO_BASE_COST from contract
        imageUrl: "/images/parts/turbo.png",
        baseVelocity: 3,  // TURBO_BASE_VELOCITY from contract
        velocityMultiplier: 1.25, // TURBO_GROWTH_FACTOR from contract (1.25)
    },
    {
        id: "chassis-1",
        type: PartType.CHASSIS,
        name: "Chassis",
        currentLevel: 1,
        upgradeCost: 10,  // CHASSIS_BASE_COST from contract
        imageUrl: "/images/parts/chassis.png",
        baseVelocity: 1,  // CHASSIS_BASE_VELOCITY from contract
        velocityMultiplier: 1.1, // CHASSIS_GROWTH_FACTOR from contract (1.10)
    },
    {
        id: "wheels-1",
        type: PartType.WHEELS,
        name: "Wheels",
        currentLevel: 1,
        upgradeCost: 20,  // WHEEL_BASE_COST from contract
        imageUrl: "/images/parts/wheels.png",
        baseVelocity: 2,  // WHEEL_BASE_VELOCITY from contract
        velocityMultiplier: 1.15, // WHEEL_GROWTH_FACTOR from contract (1.15)
    },
];

// Implementation of getUpgradeCost based on smart contract
export const getUpgradeCost = (part: Part): number => {
    const level = part.currentLevel;

    // If it's level 1, just return the base cost
    if (level === 1) {
        return part.upgradeCost;
    }

    // Otherwise calculate based on part type
    switch (part.type) {
        case PartType.ENGINE:
            // ENGINE_BASE_COST * ENGINE_GROWTH_FACTOR^(level-1)
            return part.upgradeCost * Math.pow(part.velocityMultiplier, level - 1);
        case PartType.TURBO:
            // TURBO_BASE_COST * TURBO_GROWTH_FACTOR^(level-1)
            return part.upgradeCost * Math.pow(part.velocityMultiplier, level - 1);
        case PartType.CHASSIS:
            // CHASSIS_BASE_COST * CHASSIS_GROWTH_FACTOR^(level-1)
            return part.upgradeCost * Math.pow(part.velocityMultiplier, level - 1);
        case PartType.WHEELS:
            // WHEEL_BASE_COST * WHEEL_GROWTH_FACTOR^(level-1)
            return part.upgradeCost * Math.pow(part.velocityMultiplier, level - 1);
        default:
            return part.upgradeCost;
    }
};

// Implementation of getCurrentVelocity based on smart contract
export const getCurrentVelocity = (part: Part): number => {
    // All velocity calculations are simple: baseVelocity * level
    return part.baseVelocity * part.currentLevel;
}; 