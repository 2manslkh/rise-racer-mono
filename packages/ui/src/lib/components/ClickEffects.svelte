<script lang="ts" context="module">
	export interface ClickEffect {
		x: number;
		y: number;
		opacity: number;
		offset: number;
	}

	export let globalAddClickEffect: ((x: number, y: number) => void) | null = null;
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';

	let effectsCanvas: HTMLCanvasElement;
	let effectsCtx: CanvasRenderingContext2D | null = null;
	let animationFrameId: number;
	let clickEffects: ClickEffect[] = [];

	function addClickEffect(x: number, y: number) {
		clickEffects = [
			...clickEffects,
			{
				x,
				y,
				opacity: 1,
				offset: 0
			}
		];
	}

	// Expose the addClickEffect function globally
	globalAddClickEffect = addClickEffect;

	function drawEffects() {
		if (!effectsCtx || !effectsCanvas) return;

		effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);

		effectsCtx.save();
		effectsCtx.font = "bold 24px 'Press Start 2P'";
		effectsCtx.textAlign = 'center';
		effectsCtx.shadowColor = '#ff1b6b';
		effectsCtx.shadowBlur = 10;

		clickEffects.forEach((effect) => {
			effectsCtx!.fillStyle = `rgba(255, 27, 107, ${effect.opacity})`;
			effectsCtx!.fillText('+1', effect.x, effect.y - effect.offset);
		});

		effectsCtx.restore();

		// Update effects
		clickEffects = clickEffects
			.map((effect) => ({
				...effect,
				opacity: effect.opacity - 0.02,
				offset: effect.offset + 1.5
			}))
			.filter((effect) => effect.opacity > 0);
	}

	function animate() {
		drawEffects();
		animationFrameId = requestAnimationFrame(animate);
	}

	let resizeTimeout: number;

	function handleResize() {
		if (!browser || !effectsCanvas) return;

		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			const width = window.innerWidth;
			const height = window.innerHeight;

			effectsCanvas.width = width;
			effectsCanvas.height = height;
		}, 250) as unknown as number;
	}

	onMount(() => {
		if (!browser || !effectsCanvas) return;

		effectsCtx = effectsCanvas.getContext('2d');
		if (!effectsCtx) return;

		effectsCanvas.width = window.innerWidth;
		effectsCanvas.height = window.innerHeight;

		window.addEventListener('resize', handleResize);
		animationFrameId = requestAnimationFrame(animate);
	});

	onDestroy(() => {
		if (!browser) return;
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
		window.removeEventListener('resize', handleResize);
		globalAddClickEffect = null;
	});
</script>

<canvas bind:this={effectsCanvas} class="pointer-events-none fixed inset-0 z-20" />
