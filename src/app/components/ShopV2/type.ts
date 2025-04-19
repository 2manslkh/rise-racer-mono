export enum PartType {
    ENGINE = "Engine",
    TURBO = "Turbo",
    CHASSIS = "Chassis",
    WHEELS = "Wheels",
}

export interface Part {
    id: string; // Unique identifier for the part instance if needed
    type: PartType;
    name: string;
    currentLevel: number;
    maxLevel: number;
    upgradeCost: number; // Base cost in RiseCrystals for level 1
    // Add any other relevant properties, e.g., image URL
    imageUrl?: string;

    // New properties for performance
    baseVelocity: number;
    velocityMultiplier: number; // This could be a base multiplier or calculated based on level
} 