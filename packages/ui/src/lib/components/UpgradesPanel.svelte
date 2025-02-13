<script lang="ts">
	export let autoClickersCount: number;
	export let autoClickerCost: number;
	export let velocity: number;
	export let onBuyAutoClicker: () => void;

	// Format large numbers
	function formatNumber(num: number): string {
		if (num < 1000) return num.toFixed(0);
		const units = ['K', 'M', 'B', 'T'];
		const order = Math.floor(Math.log(num) / Math.log(1000));
		const unitName = units[order - 1];
		const value = num / Math.pow(1000, order);
		return `${value.toFixed(1)}${unitName}`;
	}
</script>

<div class="w-full border-t-2 border-pink-500 bg-black/80 p-4 backdrop-blur-sm">
	<div class="space-y-2">
		<h2 class="font-['Press_Start_2P'] text-sm font-bold text-cyan-400">UPGRADES</h2>
		<div class="flex items-center justify-between rounded-lg bg-black/40 p-3">
			<div>
				<h3 class="font-['Press_Start_2P'] text-xs font-bold text-pink-400">AUTO BOOSTER</h3>
				<p class="mt-1 font-['Press_Start_2P'] text-xs text-gray-300">
					LVL: {autoClickersCount}
				</p>
			</div>
			<button
				on:click={onBuyAutoClicker}
				class:opacity-50={velocity < autoClickerCost}
				class:cursor-not-allowed={velocity < autoClickerCost}
				disabled={velocity < autoClickerCost}
				class="touch-none rounded border-2 border-green-500 bg-green-800 px-3 py-2 font-['Press_Start_2P'] text-xs font-bold text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.3)] transition select-none active:scale-95"
			>
				BUY ({formatNumber(autoClickerCost)})
			</button>
		</div>
	</div>
</div>
