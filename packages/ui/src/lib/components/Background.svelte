<script lang="ts">
	import { LIGHT_SPEED } from '$lib/types/game';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let velocity: number;

	let bgCanvas: HTMLCanvasElement;
	let bgCtx: CanvasRenderingContext2D | null = null;
	let animationFrameId: number;
	let gridOffset = 0;
	let mountainOffset = 0;

	// Grid properties
	const GRID_SIZE = 40;
	const GRID_COLOR = 'rgba(255, 255, 255, 0.2)';
	const MOUNTAIN_COLOR = 'rgba(255, 255, 255, 0.3)';

	// Mountain properties
	const MOUNTAIN_SEGMENTS = 24;
	const MOUNTAIN_RANGES = 4;
	const MOUNTAIN_PEAK_HEIGHT = 0.5;
	let MOUNTAIN_HEIGHT = 0;

	function calculateSpeed(velocity: number): number {
		const MAX_SPEED = 300;
		const MIN_SPEED = 10;

		if (velocity <= 0) return 0;

		const logScale = Math.log10(velocity + 1) / Math.log10(LIGHT_SPEED);
		const speed = MIN_SPEED + logScale * (MAX_SPEED - MIN_SPEED);

		return Math.min(MAX_SPEED, Math.max(MIN_SPEED, speed));
	}

	function drawMountains() {
		if (!bgCtx || !bgCanvas) return;

		// Draw multiple mountain ranges with parallax
		for (let range = 0; range < MOUNTAIN_RANGES; range++) {
			const rangeOffset = range * 50;
			const moveSpeed = (range + 1) * mountainOffset * 0.3;
			const alpha = 0.4 - range * 0.08;
			const heightMultiplier = 1 - range * 0.15;

			const gradient = bgCtx.createLinearGradient(0, 0, 0, bgCanvas.height * 0.5);
			gradient.addColorStop(0, `rgba(255, 20, 147, ${alpha})`);
			gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.5})`);
			bgCtx.fillStyle = gradient;

			bgCtx.beginPath();
			bgCtx.moveTo(0, bgCanvas.height * 0.5);

			for (let i = 0; i <= MOUNTAIN_SEGMENTS; i++) {
				const x = (bgCanvas.width * i) / MOUNTAIN_SEGMENTS;
				const baseHeight =
					Math.sin((i * (range + 1) + moveSpeed) * 0.3) *
					(bgCanvas.height * MOUNTAIN_PEAK_HEIGHT * heightMultiplier);
				const sharpness = Math.pow(Math.sin((i * 0.5 + rangeOffset + moveSpeed) * 0.5), 2) * 60;
				const height = MOUNTAIN_HEIGHT + baseHeight + sharpness;
				bgCtx.lineTo(x, height);
			}

			bgCtx.lineTo(bgCanvas.width, bgCanvas.height * 0.5);
			bgCtx.lineTo(0, bgCanvas.height * 0.5);
			bgCtx.closePath();
			bgCtx.fill();

			const gridGradient = bgCtx.createLinearGradient(0, 0, 0, bgCanvas.height * 0.5);
			gridGradient.addColorStop(0, `rgba(255, 192, 203, ${alpha * 0.7})`);
			gridGradient.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.3})`);
			bgCtx.strokeStyle = gridGradient;
			bgCtx.lineWidth = 1;

			for (let y = MOUNTAIN_HEIGHT; y < bgCanvas.height * 0.5; y += 30) {
				bgCtx.beginPath();
				bgCtx.moveTo(0, y);
				bgCtx.lineTo(bgCanvas.width, y);
				bgCtx.stroke();
			}

			for (let x = -moveSpeed % 60; x < bgCanvas.width; x += 60) {
				bgCtx.beginPath();
				bgCtx.moveTo(x, MOUNTAIN_HEIGHT);
				bgCtx.lineTo(x, bgCanvas.height * 0.5);
				bgCtx.stroke();
			}
		}
	}

	function drawBackground() {
		if (!bgCtx || !bgCanvas) return;

		const gradient = bgCtx.createLinearGradient(0, 0, 0, bgCanvas.height);
		gradient.addColorStop(0, '#2b0054');
		gradient.addColorStop(1, '#ff1b6b');
		bgCtx.fillStyle = gradient;
		bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

		bgCtx.strokeStyle = GRID_COLOR;
		bgCtx.lineWidth = 1;

		const vanishingPointX = bgCanvas.width / 2;
		const vanishingPointY = -50;
		const bottomWidth = bgCanvas.width * 1.5;
		const numLines = 20;

		for (let i = 0; i <= numLines; i++) {
			const x = (i / numLines) * bottomWidth - (bottomWidth - bgCanvas.width) / 2;
			bgCtx.beginPath();
			bgCtx.moveTo(vanishingPointX, vanishingPointY);
			bgCtx.lineTo(x, bgCanvas.height);
			bgCtx.stroke();
		}

		const numHorizontalLines = 15;
		for (let i = 0; i <= numHorizontalLines; i++) {
			const progress = (i / numHorizontalLines + gridOffset) % 1;
			const y = vanishingPointY + (bgCanvas.height - vanishingPointY) * progress;
			const leftX =
				vanishingPointX - (vanishingPointX - (-bottomWidth / 2 + bgCanvas.width / 2)) * progress;
			const rightX =
				vanishingPointX + (bottomWidth / 2 + bgCanvas.width / 2 - vanishingPointX) * progress;

			bgCtx.beginPath();
			bgCtx.moveTo(leftX, y);
			bgCtx.lineTo(rightX, y);
			bgCtx.stroke();
		}

		drawMountains();
	}

	let lastTime = 0;
	function animate(currentTime: number) {
		if (!bgCtx || !bgCanvas) return;

		if (!lastTime) lastTime = currentTime;
		const deltaTime = (currentTime - lastTime) / 1000;
		lastTime = currentTime;

		const speed = calculateSpeed(velocity);
		gridOffset = (gridOffset + speed * deltaTime * 0.2) % 1;
		mountainOffset = (mountainOffset + speed * deltaTime * 0.1) % 1000;

		bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
		drawBackground();

		animationFrameId = requestAnimationFrame(animate);
	}

	let resizeTimeout: number;

	function handleResize() {
		if (!browser || !bgCanvas) return;

		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			const width = window.innerWidth;
			const height = window.innerHeight;

			bgCanvas.width = width;
			bgCanvas.height = height;
			MOUNTAIN_HEIGHT = height * 0.3;
		}, 250) as unknown as number;
	}

	onMount(() => {
		if (!browser || !bgCanvas) return;

		bgCtx = bgCanvas.getContext('2d');
		if (!bgCtx) return;

		const width = window.innerWidth;
		const height = window.innerHeight;

		bgCanvas.width = width;
		bgCanvas.height = height;
		MOUNTAIN_HEIGHT = height * 0.3;

		window.addEventListener('resize', handleResize);
		animationFrameId = requestAnimationFrame(animate);
	});

	onDestroy(() => {
		if (!browser) return;
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
		window.removeEventListener('resize', handleResize);
	});
</script>

{#if browser}
	<canvas bind:this={bgCanvas} class="background-canvas"> </canvas>
{/if}

<style>
	.background-canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -2;
	}
</style>
