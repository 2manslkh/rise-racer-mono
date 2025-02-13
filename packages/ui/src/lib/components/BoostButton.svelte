<script lang="ts">
	export let isBoosting: boolean;
	export let isClicking: boolean;
	export let boostCooldown: boolean;
	export let onClick: () => void;
</script>

<button
	on:click={onClick}
	class:boost-active={isBoosting}
	class:boost-cooldown={boostCooldown && !isBoosting}
	class="group relative h-32 w-32 transform touch-none rounded-full border-4 border-red-500 bg-gradient-to-br from-red-600 to-red-800 font-['Press_Start_2P'] text-base font-bold shadow-lg transition-all select-none active:scale-95"
>
	<span
		class="absolute inset-0 rounded-full bg-red-400/20 transition-transform group-hover:scale-110 group-active:scale-95"
	/>
	<span class="relative z-10">
		{#if isBoosting}
			5x BOOST!
		{:else}
			BOOST!
		{/if}
	</span>
	{#if isClicking}
		<span
			class="absolute inset-0 animate-ping rounded-full bg-red-400/75"
			style="animation-duration: 0.5s;"
		/>
	{/if}
	{#if isBoosting}
		<span class="boost-ring"></span>
	{/if}
</button>

<style>
	/* Boost button styles */
	.boost-active {
		animation: pulse 0.5s infinite;
		border-color: #ffd700 !important;
		background: linear-gradient(to bottom right, #ff4500, #ff8c00) !important;
		box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
	}

	.boost-cooldown {
		opacity: 0.5;
		cursor: not-allowed;
		border-color: #666 !important;
		background: linear-gradient(to bottom right, #444, #666) !important;
	}

	.boost-ring {
		position: absolute;
		inset: -8px;
		border: 4px solid #ffd700;
		border-radius: 50%;
		animation: boost-ring 1s linear infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	@keyframes boost-ring {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(1.5);
			opacity: 0;
		}
	}
</style>
