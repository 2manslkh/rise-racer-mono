import { writable, derived } from 'svelte/store';

interface GameState {
    velocity: number;
    velocityPerClick: number;
    autoClickersCount: number;
    autoClickerCost: number;
    isClicking: boolean;
    isBoosting: boolean;
    boostMultiplier: number;
    boostCooldown: boolean;
}

// Initial game state
const initialState: GameState = {
    velocity: 0,
    velocityPerClick: 1,
    autoClickersCount: 0,
    autoClickerCost: 10,
    isClicking: false,
    isBoosting: false,
    boostMultiplier: 1,
    boostCooldown: false
};

// Create the main game store
function createGameStore() {
    const { subscribe, set, update } = writable<GameState>(initialState);

    return {
        subscribe,
        // Reset game state
        reset: () => set(initialState),

        // State setters
        setIsClicking: (value: boolean) => {
            update(state => ({ ...state, isClicking: value }));
        },
        setIsBoosting: (value: boolean) => {
            update(state => ({ ...state, isBoosting: value }));
        },
        setBoostCooldown: (value: boolean) => {
            update(state => ({ ...state, boostCooldown: value }));
        },

        // Click actions
        handleClick: () => {
            update((state) => {
                // Always increase velocity by 1 (default)
                state.velocity += state.velocityPerClick;
                state.isClicking = true;

                // If not in cooldown and not boosting, activate boost
                if (!state.boostCooldown && !state.isBoosting) {
                    state.isBoosting = true;
                    state.boostMultiplier = 5;
                    state.boostCooldown = true;

                    // Boost duration
                    setTimeout(() => {
                        update(s => ({
                            ...s,
                            isBoosting: false,
                            boostMultiplier: 1
                        }));
                    }, 3000);

                    // Cooldown period
                    setTimeout(() => {
                        update(s => ({ ...s, boostCooldown: false }));
                    }, 10000);
                }

                // Reset clicking animation
                setTimeout(() => {
                    update(s => ({ ...s, isClicking: false }));
                }, 100);

                return state;
            });
        },

        // Upgrade actions
        buyAutoClicker: () => {
            update((state) => {
                if (state.velocity >= state.autoClickerCost) {
                    state.velocity -= state.autoClickerCost;
                    state.autoClickersCount++;
                    state.autoClickerCost = Math.floor(state.autoClickerCost * 1.15);
                }
                return state;
            });
        },

        // Auto clicker effect
        startAutoClicker: () => {
            const interval = setInterval(() => {
                update((state) => {
                    state.velocity += state.autoClickersCount;
                    return state;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    };
}

// Create and export the game store
export const gameStore = createGameStore();

// Derived stores for specific values
export const velocity = derived(gameStore, $game => $game.velocity);
export const autoClickersCount = derived(gameStore, $game => $game.autoClickersCount);
export const autoClickerCost = derived(gameStore, $game => $game.autoClickerCost);
export const isClicking = derived(gameStore, $game => $game.isClicking);
export const isBoosting = derived(gameStore, $game => $game.isBoosting);
export const boostCooldown = derived(gameStore, $game => $game.boostCooldown);

// Helper function for formatting numbers
export function formatNumber(num: number): string {
    if (num < 1000) return num.toFixed(0);
    const units = ['K', 'M', 'B', 'T'];
    const order = Math.floor(Math.log(num) / Math.log(1000));
    const unitName = units[order - 1];
    const value = num / Math.pow(1000, order);
    return `${value.toFixed(1)}${unitName}`;
} 