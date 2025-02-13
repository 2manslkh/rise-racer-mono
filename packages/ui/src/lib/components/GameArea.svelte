<script lang="ts">
	export let velocity: number;
	export let isBoosting: boolean;
	export let onClick: () => void;
</script>

<div class="absolute inset-0">
	<div class="h-full w-full border-y-2 border-white/10 bg-black/20 shadow-lg backdrop-blur">
		<slot />
	</div>
</div>
