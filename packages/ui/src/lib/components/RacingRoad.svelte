<script lang="ts">
	import { LIGHT_SPEED } from '$lib/types/game';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import type { ClickEffect } from './ClickEffects.svelte';
	import { globalAddClickEffect } from './ClickEffects.svelte';

	export let velocity: number;
	export let isBoosting: boolean = false;
	export let onClick: () => void;

	let roadCanvas: HTMLCanvasElement;
	let roadCtx: CanvasRenderingContext2D | null = null;
	let animationFrameId: number;
	let offset = 0;
	let carSprite: HTMLImageElement | null = null;
	let isCarLoaded = false;
	let trackHeight = 1080; // Default height

	// Track properties
	const TRACK_WIDTH = 300;
	const ROAD_SCALE = 0.5;
	const LINE_WIDTH = 8;
	const LINE_BASE_HEIGHT = 20;
	const LINE_GAP = 40;
	const ROAD_COLOR = '#333333';
	const LINE_COLOR = '#FFFFFF';
	const BORDER_COLOR = '#FFFF00';
	const BORDER_WIDTH = 4;
	const GLOW_COLOR = 'rgba(255, 255, 0, 0.5)';

	// Car properties
	const CAR_WIDTH = 16;
	const CAR_HEIGHT = 16;
	const CAR_SCALE = 3;
	const BOOST_GLOW_COLOR = 'rgba(255, 69, 0, 0.6)';

	function handleClick(event: MouseEvent | TouchEvent) {
		if (globalAddClickEffect) {
			const x = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
			const y = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
			globalAddClickEffect(x, y);
		}
		onClick();
	}

	function calculateSpeed(velocity: number): number {
		const MAX_SPEED = 300;
		const MIN_SPEED = 10;

		if (velocity <= 0) return 0;

		const logScale = Math.log10(velocity + 1) / Math.log10(LIGHT_SPEED);
		const speed = MIN_SPEED + logScale * (MAX_SPEED - MIN_SPEED);

		// Add slight acceleration curve
		return Math.min(MAX_SPEED, Math.max(MIN_SPEED, speed * (isBoosting ? 1.5 : 1)));
	}

	function drawTrack() {
		if (!roadCtx || !roadCanvas) return;

		roadCtx.clearRect(0, 0, roadCanvas.width, roadCanvas.height);

		const roadTop = roadCanvas.height * 0.2;
		const roadBottom = roadCanvas.height * 0.9;
		const roadHeight = roadBottom - roadTop;
		const topWidth = TRACK_WIDTH * ROAD_SCALE;
		const bottomWidth = TRACK_WIDTH * 1.1;
		const centerX = roadCanvas.width / 2;

		// Draw road
		roadCtx.fillStyle = ROAD_COLOR;
		roadCtx.beginPath();
		roadCtx.moveTo(centerX - topWidth / 2, roadTop);
		roadCtx.lineTo(centerX + topWidth / 2, roadTop);
		roadCtx.lineTo(centerX + bottomWidth / 2, roadBottom);
		roadCtx.lineTo(centerX - bottomWidth / 2, roadBottom);
		roadCtx.closePath();
		roadCtx.fill();

		// Draw borders with glow
		roadCtx.strokeStyle = BORDER_COLOR;
		roadCtx.lineWidth = BORDER_WIDTH;
		roadCtx.shadowColor = GLOW_COLOR;
		roadCtx.shadowBlur = 10;
		roadCtx.beginPath();
		roadCtx.moveTo(centerX - topWidth / 2, roadTop);
		roadCtx.lineTo(centerX - bottomWidth / 2, roadBottom);
		roadCtx.moveTo(centerX + topWidth / 2, roadTop);
		roadCtx.lineTo(centerX + bottomWidth / 2, roadBottom);
		roadCtx.stroke();
		roadCtx.shadowBlur = 0;

		// Draw lines with perspective
		roadCtx.fillStyle = LINE_COLOR;
		const totalLines = Math.ceil(roadHeight / LINE_GAP) + 1;

		for (let i = 0; i < totalLines; i++) {
			const progress = ((i * LINE_GAP + offset) % roadHeight) / roadHeight;
			const y = roadTop + roadHeight * progress;

			// Exponential scaling for more dramatic perspective
			const perspectiveScale = Math.pow(progress, 1.5);
			const width = topWidth + (bottomWidth - topWidth) * progress;
			const lineWidth = LINE_WIDTH * (0.3 + perspectiveScale * 0.7);
			const lineHeight = LINE_BASE_HEIGHT * perspectiveScale;

			// Adjust spacing based on perspective
			const adjustedY = y - (lineHeight * perspectiveScale) / 2;

			roadCtx.fillRect(centerX - lineWidth / 2, adjustedY, lineWidth, lineHeight);
		}

		drawCar();
	}

	function drawSpeedLines() {
		if (!roadCtx || !roadCanvas) return;

		if (velocity > 1000) {
			const alpha = Math.min((velocity - 1000) / 10000, 0.5);
			roadCtx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
			roadCtx.lineWidth = 2;

			for (let i = 0; i < 20; i++) {
				const x = Math.random() * roadCanvas.width;
				const length = Math.random() * 50 + 50;
				const y = Math.random() * roadCanvas.height;

				roadCtx.beginPath();
				roadCtx.moveTo(x, y);
				roadCtx.lineTo(x, y + length);
				roadCtx.stroke();
			}
		}
	}

	function drawCar() {
		if (!roadCtx || !roadCanvas || !carSprite || !isCarLoaded) return;

		const carX = roadCanvas.width / 2 - (CAR_WIDTH * CAR_SCALE) / 2;
		const carY = roadCanvas.height * 0.7;

		if (isBoosting) {
			roadCtx.shadowColor = BOOST_GLOW_COLOR;
			roadCtx.shadowBlur = 20;
		}

		roadCtx.imageSmoothingEnabled = false;
		roadCtx.drawImage(
			carSprite,
			0,
			0,
			CAR_WIDTH,
			CAR_HEIGHT,
			carX,
			carY,
			CAR_WIDTH * CAR_SCALE,
			CAR_HEIGHT * CAR_SCALE
		);

		roadCtx.shadowBlur = 0;
	}

	let lastTime = 0;
	function animate(currentTime: number) {
		if (!roadCtx || !roadCanvas) return;

		if (!lastTime) lastTime = currentTime;
		const deltaTime = (currentTime - lastTime) / 1000;
		lastTime = currentTime;

		const speed = calculateSpeed(velocity);
		offset = (offset + speed * deltaTime) % trackHeight;

		drawTrack();
		drawSpeedLines();

		animationFrameId = requestAnimationFrame(animate);
	}

	let resizeTimeout: number;

	function handleResize() {
		if (!browser || !roadCanvas) return;

		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			const container = roadCanvas.parentElement;
			if (!container) return;

			const rect = container.getBoundingClientRect();
			roadCanvas.width = rect.width;
			roadCanvas.height = rect.height;
			trackHeight = rect.height;

			// Redraw immediately after resize
			if (roadCtx) {
				drawTrack();
				drawSpeedLines();
			}
		}, 250) as unknown as number;
	}

	onMount(() => {
		if (!browser || !roadCanvas) return;

		roadCtx = roadCanvas.getContext('2d');
		if (!roadCtx) return;

		const container = roadCanvas.parentElement;
		if (!container) return;

		const rect = container.getBoundingClientRect();
		roadCanvas.width = rect.width;
		roadCanvas.height = rect.height;
		trackHeight = rect.height;

		// Create a ResizeObserver to handle container size changes
		const resizeObserver = new ResizeObserver(() => handleResize());
		resizeObserver.observe(container);

		window.addEventListener('resize', handleResize);

		carSprite = new Image();
		carSprite.src = '/sprites/car-16x16.png';
		carSprite.onload = () => {
			isCarLoaded = true;
		};

		animationFrameId = requestAnimationFrame(animate);

		return () => {
			resizeObserver.disconnect();
		};
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
	<div class="absolute inset-0 h-full">
		<canvas
			bind:this={roadCanvas}
			class="block h-full w-full"
			on:click={handleClick}
			on:touchstart|preventDefault={handleClick}
		>
		</canvas>
	</div>
{/if}

<style>
	canvas {
		cursor: url(https://cur.cursors-4u.net/cursors/cur-2/cur117.cur), auto !important;
	}
</style>
