<script lang="ts">
	export let velocity: number;

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

<div class="sticky top-0 z-10 border-b-2 border-cyan-400 bg-black/80 p-2 backdrop-blur-sm">
	<div class="flex items-center justify-center gap-2">
		<span class="font-['Press_Start_2P'] text-sm text-cyan-400">VELOCITY:</span>
		<span class="font-['Press_Start_2P'] text-sm font-bold text-yellow-400">
			{formatNumber(velocity)} m/s
		</span>
	</div>
</div>
