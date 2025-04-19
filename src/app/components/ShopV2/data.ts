import { Part, PartType } from "./type";

// TODO: Replace this mock data with actual data from state management
export const initialPartsData: Part[] = [
    {
        id: "engine-1",
        type: PartType.ENGINE,
        name: "Stock Engine",
        currentLevel: 1,
        maxLevel: 10,
        upgradeCost: 100, // Base cost
        imageUrl: "/images/parts/engine.png",
        baseVelocity: 10,
        velocityMultiplier: 1.1,
    },
    {
        id: "turbo-1",
        type: PartType.TURBO,
        name: "Basic Turbo",
        currentLevel: 1,
        maxLevel: 8,
        upgradeCost: 150,
        imageUrl: "/images/parts/turbo.png",
        baseVelocity: 5, // Turbos might add less base but more multiplier
        velocityMultiplier: 1.25,
    },
    {
        id: "chassis-1",
        type: PartType.CHASSIS,
        name: "Standard Chassis",
        currentLevel: 1,
        maxLevel: 12,
        upgradeCost: 80,
        imageUrl: "/images/parts/chassis.png",
        baseVelocity: 2, // Chassis might offer smaller direct speed boosts
        velocityMultiplier: 1.05,
    },
    {
        id: "wheels-1",
        type: PartType.WHEELS,
        name: "Default Wheels",
        currentLevel: 1,
        maxLevel: 15,
        upgradeCost: 50,
        imageUrl: "/images/parts/wheels.png",
        baseVelocity: 8,
        velocityMultiplier: 1.08,
    },
];

// TODO: Function to fetch the actual upgrade cost based on the current level
export const getUpgradeCost = (part: Part): number => {
    // Example: Cost increases exponentially with level
    return part.upgradeCost * Math.pow(1.2, part.currentLevel - 1);
};

// TODO: Function to calculate current velocity contribution based on level
export const getCurrentVelocity = (part: Part): number => {
    // Example: Multiplier increases with level
    const levelMultiplier = 1 + (part.velocityMultiplier - 1) * part.currentLevel;
    return part.baseVelocity * levelMultiplier;
}; 