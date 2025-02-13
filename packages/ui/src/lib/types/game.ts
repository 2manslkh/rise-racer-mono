// Milestone Types
export interface Milestone {
    id: number;
    name: string;
    speed: number;
    description: string;
    isAchieved: boolean;
    nftBadgeId?: string;
}

// Universe Types
export interface Universe {
    id: number;
    multiplier: number;
    badgeName: string;
    isUnlocked: boolean;
    requiresSpeed: number;
}

// Cosmic Parts Types
export enum PartType {
    ENGINE = 'ENGINE',
    TURBO = 'TURBO',
    CHASSIS = 'CHASSIS',
    WHEELS = 'WHEELS'
}

export enum PartRarity {
    COMMON = 'COMMON',
    RARE = 'RARE',
    EPIC = 'EPIC',
    LEGENDARY = 'LEGENDARY'
}

export interface CosmicPart {
    id: string;
    type: PartType;
    rarity: PartRarity;
    baseVelocityIncrease: number;
    percentageIncrease: number;
    cost: number;
    isEquipped: boolean;
}

// Game State Types
export interface GameState {
    velocity: number;
    velocityPerClick: number;
    autoClickersCount: number;
    autoClickerCost: number;
    isClicking: boolean;
    isBoosting: boolean;
    boostMultiplier: number;
    boostCooldown: boolean;
    currentUniverse: number;
    equippedParts: Partial<Record<PartType, CosmicPart>>;
    unlockedMilestones: number[];
    riseCrystals: number;
    totalRebirths: number;
}

// Staking Types
export interface StakingInfo {
    stakedAmount: number;
    minimumStake: number;
    maximumStake: number;
    stakingFeePercentage: number;
    unstakingCooldown: number;
    crystalsPerHour: number;
}

// Constants
export const LIGHT_SPEED = 299792458; // meters per second
export const MILESTONES: Milestone[] = [
    {
        id: 1,
        name: 'Ignition',
        speed: 50,
        description: 'Kick off your journey with a modest burst of speed.',
        isAchieved: false
    },
    {
        id: 2,
        name: 'Sound Barrier',
        speed: 343,
        description: 'Smash through the barrier that once defined high-speed travel.',
        isAchieved: false
    },
    {
        id: 3,
        name: 'Suborbital Flight',
        speed: 1000,
        description: 'Experience your first taste of spacebound velocity.',
        isAchieved: false
    },
    {
        id: 4,
        name: 'Orbital Velocity',
        speed: 7800,
        description: 'Reach the speed necessary to achieve low Earth orbit.',
        isAchieved: false
    },
    {
        id: 5,
        name: 'Escape Velocity',
        speed: 11200,
        description: 'Break free from Earth\'s gravitational pull.',
        isAchieved: false
    },
    {
        id: 6,
        name: 'Initial Cosmic Leap',
        speed: 300000, // 0.1% of Light Speed
        description: 'Take a significant step into the cosmic arena.',
        isAchieved: false
    },
    {
        id: 7,
        name: 'Rapid Acceleration',
        speed: 3000000, // 1% of Light Speed
        description: 'Accelerate dramatically as you leave the familiar behind.',
        isAchieved: false
    },
    {
        id: 8,
        name: 'Hyper Drive',
        speed: 30000000, // 10% of Light Speed
        description: 'Engage your hyper drive and begin interstellar travel.',
        isAchieved: false
    },
    {
        id: 9,
        name: 'Cosmic Sprint',
        speed: 75000000, // 25% of Light Speed
        description: 'Pick up the pace with a burst that pushes you further than ever before.',
        isAchieved: false
    },
    {
        id: 10,
        name: 'Superluminal Approach',
        speed: 150000000, // 50% of Light Speed
        description: 'Reach the midpoint of your journey to the cosmic barrier.',
        isAchieved: false
    },
    {
        id: 11,
        name: 'Near Light-Speed',
        speed: 270000000, // 90% of Light Speed
        description: 'Nudge closer to the ultimate limit as you edge near light speed.',
        isAchieved: false
    },
    {
        id: 12,
        name: 'Final Thrust',
        speed: 297000000, // 99% of Light Speed
        description: 'Give your final burst to prepare for the ultimate transformation.',
        isAchieved: false
    },
    {
        id: 13,
        name: 'Light Speed Achievement',
        speed: LIGHT_SPEED, // 299,792,458 m/s
        description: 'Achieve the legendary milestone—breaking the ultimate speed barrier.',
        isAchieved: false
    }
];

export const UNIVERSES: Universe[] = [
    {
        id: 1,
        multiplier: 1,
        badgeName: 'Speedster Badge',
        isUnlocked: true,
        requiresSpeed: 0
    },
    {
        id: 2,
        multiplier: 1.5,
        badgeName: 'Speed Demon Badge',
        isUnlocked: false,
        requiresSpeed: LIGHT_SPEED
    },
    {
        id: 3,
        multiplier: 2.25,
        badgeName: 'Speed Deity Badge',
        isUnlocked: false,
        requiresSpeed: LIGHT_SPEED
    },
    {
        id: 4,
        multiplier: 3.38,
        badgeName: 'God of Speed, Hermes Badge',
        isUnlocked: false,
        requiresSpeed: LIGHT_SPEED
    },
    {
        id: 5,
        multiplier: 5.06,
        badgeName: 'The fastest man alive badge',
        isUnlocked: false,
        requiresSpeed: LIGHT_SPEED
    }
];

export const PART_BASE_STATS: Record<PartType, { baseVelocity: number; percentageIncrease: number }> = {
    [PartType.ENGINE]: { baseVelocity: 10, percentageIncrease: 0.001 },
    [PartType.TURBO]: { baseVelocity: 5, percentageIncrease: 0.0005 },
    [PartType.CHASSIS]: { baseVelocity: 3, percentageIncrease: 0.0003 },
    [PartType.WHEELS]: { baseVelocity: 2, percentageIncrease: 0.0002 }
};

export const RARITY_MULTIPLIERS: Record<PartRarity, number> = {
    [PartRarity.COMMON]: 1,
    [PartRarity.RARE]: 3,
    [PartRarity.EPIC]: 6,
    [PartRarity.LEGENDARY]: 10
};

export const PART_COSTS: Record<PartRarity, number> = {
    [PartRarity.COMMON]: 1000,
    [PartRarity.RARE]: 5000,
    [PartRarity.EPIC]: 20000,
    [PartRarity.LEGENDARY]: 100000
}; 