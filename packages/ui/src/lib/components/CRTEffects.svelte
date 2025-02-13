<script lang="ts">
</script>

<style>
	:global(.min-h-screen::before) {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0) 0px,
			rgba(0, 0, 0, 0.05) 1px,
			rgba(0, 0, 0, 0.1) 2px
		);
		background-size: 100% 3px;
		pointer-events: none;
		z-index: 50;
		animation: scanline 8s linear infinite;
		mix-blend-mode: multiply;
		opacity: 0.7;
	}

	:global(.min-h-screen::after) {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(
			circle at center,
			transparent 0%,
			rgba(0, 0, 0, 0.2) 90%,
			rgba(0, 0, 0, 0.4) 100%
		);
		pointer-events: none;
		z-index: 52;
		opacity: 0.8;
		animation: vignette 4s ease-in-out infinite;
	}

	:global(.min-h-screen) {
		position: relative;
		animation:
			flicker 0.12s infinite,
			distort 8s infinite;
	}

	@keyframes flicker {
		0% {
			opacity: 0.97;
			filter: brightness(0.98) contrast(1);
		}
		25% {
			opacity: 0.98;
			filter: brightness(1) contrast(1.02);
		}
		50% {
			opacity: 0.99;
			filter: brightness(0.99) contrast(0.99);
		}
		75% {
			opacity: 0.98;
			filter: brightness(1.01) contrast(1.01);
		}
		100% {
			opacity: 0.97;
			filter: brightness(0.98) contrast(1);
		}
	}

	@keyframes vignette {
		0%,
		100% {
			opacity: 0.8;
		}
		50% {
			opacity: 0.85;
		}
	}

	@keyframes scanline {
		0% {
			transform: translateY(0%);
		}
		100% {
			transform: translateY(100%);
		}
	}
</style>
