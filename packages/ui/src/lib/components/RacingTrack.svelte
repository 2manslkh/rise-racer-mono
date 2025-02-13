<script lang="ts">
	import { browser } from '$app/environment';
	import Background from './Background.svelte';
	import RacingRoad from './RacingRoad.svelte';

	export let velocity: number;
	export let isBoosting: boolean = false;
	export let onClick: () => void;
</script>

{#if browser}
	<div class="racing-track">
		<Background {velocity} />
		<RacingRoad {velocity} {isBoosting} {onClick} />
	</div>
{/if}

<style>
	.racing-track {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
</style>
