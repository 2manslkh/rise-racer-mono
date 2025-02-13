<script lang="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import Header from '$lib/components/Header.svelte';
	import StatsBar from '$lib/components/StatsBar.svelte';
	import GameArea from '$lib/components/GameArea.svelte';
	import RacingRoad from '$lib/components/RacingRoad.svelte';
	import Background from '$lib/components/Background.svelte';
	import BoostButton from '$lib/components/BoostButton.svelte';
	import UpgradesPanel from '$lib/components/UpgradesPanel.svelte';
	import CRTEffects from '$lib/components/CRTEffects.svelte';
	import {
		gameStore,
		velocity,
		autoClickersCount,
		autoClickerCost,
		isClicking,
		isBoosting,
		boostCooldown
	} from '$lib/stores/game';
	import MusicPlayer from '$lib/components/MusicPlayer.svelte';

	// Start auto clicker effect
	$effect(() => {
		if (!browser) return;
		const cleanup = gameStore.startAutoClicker();
		return cleanup;
	});

	// Format large numbers
	function formatNumber(num: number): string {
		if (num < 1000) return num.toFixed(0);
		const units = ['K', 'M', 'B', 'T'];
		const order = Math.floor(Math.log(num) / Math.log(1000));
		const unitName = units[order - 1];
		const value = num / Math.pow(1000, order);
		return `${value.toFixed(1)}${unitName}`;
	}

	let boostTimeout: number;
	let clickTimeout: number;

	function handleClick() {
		if (!browser) return;
		console.log('handleClick');
		if ($boostCooldown) return;

		// Update store values
		gameStore.setIsClicking(true);
		gameStore.setIsBoosting(true);

		// Handle the actual click
		gameStore.handleClick();

		// Clear any existing timeouts
		clearTimeout(boostTimeout);
		clearTimeout(clickTimeout);

		// Reset clicking state after a short delay
		clickTimeout = setTimeout(() => {
			gameStore.setIsClicking(false);
		}, 100) as unknown as number;

		// Reset boosting state after 5 seconds
		boostTimeout = setTimeout(() => {
			gameStore.setIsBoosting(false);
			gameStore.setBoostCooldown(true);

			// Reset cooldown after 2 seconds
			setTimeout(() => {
				gameStore.setBoostCooldown(false);
			}, 2000);
		}, 5000) as unknown as number;
	}

	// Cleanup timeouts on component destroy
	onDestroy(() => {
		if (!browser) return;
		clearTimeout(boostTimeout);
		clearTimeout(clickTimeout);
	});
</script>

<CRTEffects />

<div class="flex min-h-screen flex-col bg-black text-white">
	<div class="mx-auto w-full max-w-4xl sm:px-4">
		<Header />

		<main class="relative flex flex-col">
			<Background velocity={$velocity} />
			<StatsBar velocity={$velocity} />
			<MusicPlayer />

			<div class="relative min-h-[calc(100vh-200px)]">
				<GameArea velocity={$velocity} isBoosting={$isBoosting} onClick={handleClick}>
					<RacingRoad velocity={$velocity} isBoosting={$isBoosting} onClick={handleClick} />
				</GameArea>
			</div>

			<div class="fixed right-0 bottom-0 left-0 z-10">
				<div class="mx-auto w-full max-w-4xl sm:px-4">
					<UpgradesPanel
						autoClickersCount={$autoClickersCount}
						autoClickerCost={$autoClickerCost}
						velocity={$velocity}
						onBuyAutoClicker={gameStore.buyAutoClicker}
					/>
				</div>
			</div>
		</main>
	</div>
</div>

<style>
	:global(body) {
		background-color: #2b0054;
	}
</style>
