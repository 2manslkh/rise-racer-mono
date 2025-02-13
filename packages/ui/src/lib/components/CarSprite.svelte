<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	// Props
	export let isBoosting: boolean = false;
	export let scale: number = 2;

	// Canvas setup
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let sprite: HTMLImageElement;
	let isLoaded = false;
	let animationFrameId: number;

	// Sprite properties
	const SPRITE_WIDTH = 16;
	const SPRITE_HEIGHT = 16;
	const BOOST_GLOW_COLOR = 'rgba(255, 69, 0, 0.6)';

	function drawSprite() {
		if (!ctx || !isLoaded) return;

		// Clear previous frame
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Center position
		const x = (canvas.width - SPRITE_WIDTH * scale) / 2;
		const y = (canvas.height - SPRITE_HEIGHT * scale) / 2;

		// Draw boost glow
		if (isBoosting) {
			ctx.shadowColor = BOOST_GLOW_COLOR;
			ctx.shadowBlur = 20;
		}

		// Draw the sprite
		ctx.imageSmoothingEnabled = false; // Keep pixel art sharp
		ctx.drawImage(
			sprite,
			0,
			0,
			SPRITE_WIDTH,
			SPRITE_HEIGHT, // Source rectangle
			x,
			y,
			SPRITE_WIDTH * scale,
			SPRITE_HEIGHT * scale // Destination rectangle
		);

		ctx.shadowBlur = 0;
	}

	function animate() {
		drawSprite();
		animationFrameId = requestAnimationFrame(animate);
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;

		// Set canvas size to match scaled sprite with padding for glow effects
		const padding = 40; // Extra space for glow effects
		canvas.width = SPRITE_WIDTH * scale + padding;
		canvas.height = SPRITE_HEIGHT * scale + padding;

		// Load sprite
		sprite = new Image();
		sprite.src = '/sprites/car-16x16.png';
		sprite.onload = () => {
			isLoaded = true;
			animationFrameId = requestAnimationFrame(animate);
		};
	});

	onDestroy(() => {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
	});

	// Redraw when props change
	$: if (isLoaded && ctx) {
		drawSprite();
	}
</script>

<canvas bind:this={canvas} class="car-sprite"></canvas>

<style>
	.car-sprite {
		position: absolute;
		transform: translate(-50%, -50%);
		image-rendering: pixelated;
		pointer-events: none;
	}
</style>
