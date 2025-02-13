<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';
	import { SkipBack, Play, Pause, SkipForward, Music, VolumeX } from 'lucide-svelte';

	// Audio state
	let audio: HTMLAudioElement;
	let isPlaying = false;
	let volume = 0.5;
	let isVisible = true;
	let currentTime = 0;
	let duration = 0;
	let progress = 0;

	const playlist = [
		{
			title: 'Night Racer',
			url: '/music/night-racer.mp3',
			art: '/music/night-racer.jpeg',
			artist: 'Rise Racers'
		},
		{
			title: 'Rize',
			url: '/music/rize.mp3',
			art: '/music/rize.jpeg',
			artist: 'Rise Racers'
		},
		{
			title: 'Speed Demon',
			url: '/music/speed-demon.mp3',
			art: '/music/speed-demon.jpeg',
			artist: 'Rise Racers'
		},
		{
			title: 'Sunrise Drift',
			url: '/music/sunrise-drift.mp3',
			art: '/music/sunrise-drift.jpeg',
			artist: 'Rise Racers'
		},
		{
			title: 'The Ether',
			url: '/music/the-ether.mp3',
			art: '/music/the-ether.jpeg',
			artist: 'Rise Racers'
		}
	];

	let currentTrackIndex = 0;

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	onMount(() => {
		// Initialize audio
		audio = new Audio(playlist[currentTrackIndex].url);
		audio.volume = volume;

		// Add time update listener
		audio.addEventListener('timeupdate', () => {
			currentTime = audio.currentTime;
			duration = audio.duration;
			progress = (currentTime / duration) * 100;
		});

		// Add duration change listener
		audio.addEventListener('durationchange', () => {
			duration = audio.duration;
		});

		// Auto-play next track
		audio.addEventListener('ended', () => {
			nextTrack();
		});
	});

	function togglePlay() {
		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
		isPlaying = !isPlaying;
	}

	function updateVolume() {
		audio.volume = volume;
	}

	function nextTrack() {
		currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
		audio.src = playlist[currentTrackIndex].url;
		if (isPlaying) audio.play();
	}

	function previousTrack() {
		currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
		audio.src = playlist[currentTrackIndex].url;
		if (isPlaying) audio.play();
	}

	function handleProgressClick(event: MouseEvent) {
		const rect = (event.target as HTMLElement).getBoundingClientRect();
		const x = event.clientX - rect.left;
		const percentage = x / rect.width;
		audio.currentTime = percentage * duration;
	}

	function toggleVisibility() {
		isVisible = !isVisible;
	}

	onDestroy(() => {
		if (audio) audio.pause();
	});
</script>

{#if isVisible}
	<div class="music-player" transition:slide={{ duration: 300 }}>
		<div class="player-layout">
			<div class="album-art">
				<img src={playlist[currentTrackIndex].art} alt="Album Art" />
			</div>

			<div class="player-content">
				<div class="track-info">
					<div class="track-title">{playlist[currentTrackIndex].title}</div>
					<div class="time">{formatTime(currentTime)} / {formatTime(duration || 0)}</div>
				</div>

				<div class="controls">
					<button on:click={previousTrack} class="control-btn">
						<SkipBack size={20} />
					</button>
					<button on:click={togglePlay} class="control-btn play-btn">
						{#if isPlaying}
							<Pause size={20} />
						{:else}
							<Play size={20} />
						{/if}
					</button>
					<button on:click={nextTrack} class="control-btn">
						<SkipForward size={20} />
					</button>
				</div>

				<div class="progress-bar" on:click={handleProgressClick}>
					<div class="progress-fill" style="width: {progress}%" />
				</div>
			</div>
		</div>
	</div>
{/if}

<button
	class="music-toggle"
	on:click={toggleVisibility}
	title={isVisible ? 'Hide Music Player' : 'Show Music Player'}
>
	{#if isVisible}
		<Music size={20} />
	{:else}
		<VolumeX size={20} />
	{/if}
</button>

<style>
	.music-toggle {
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 40px;
		height: 40px;
		background: rgba(0, 0, 0, 0.8);
		border: 2px solid #ff1b6b;
		border-radius: 50%;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 101;
		transition: all 0.3s ease;
		box-shadow: 0 0 10px rgba(255, 27, 107, 0.3);
	}

	.music-toggle:hover {
		transform: scale(1.1);
		box-shadow: 0 0 20px rgba(255, 27, 107, 0.5);
	}

	.music-player {
		position: fixed;
		bottom: 70px;
		right: 20px;
		width: 300px;
		background: rgba(0, 0, 0, 0.8);
		border: 2px solid #ff1b6b;
		border-radius: 10px;
		padding: 10px;
		color: white;
		font-family: 'Press Start 2P', monospace;
		box-shadow: 0 0 20px rgba(255, 27, 107, 0.3);
		backdrop-filter: blur(10px);
		z-index: 100;
	}

	.player-layout {
		display: flex;
		gap: 10px;
	}

	.album-art {
		width: 80px;
		height: 80px;
		border-radius: 6px;
		overflow: hidden;
	}

	.album-art img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.player-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-width: 0;
	}

	.track-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.track-title {
		font-size: 0.8em;
		color: #45caff;
		text-shadow: 0 0 5px rgba(69, 202, 255, 0.5);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.artist-name {
		font-size: 0.6em;
		color: rgba(255, 255, 255, 0.7);
	}

	.time {
		font-size: 0.6em;
		color: rgba(255, 255, 255, 0.5);
	}

	.controls {
		height: fit-content;
		display: flex;
		justify-content: center;
		gap: 12px;
		align-items: center;
		margin: 0;
		line-height: 1;
		padding-bottom: 6px;
		padding-top: 6px;
	}

	.control-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		color: #45caff;
		padding: 4px;
		cursor: pointer;
		transition: all 0.3s ease;
		border-radius: 4px;
	}

	.control-btn:hover {
		color: #fff;
		text-shadow: 0 0 10px rgba(69, 202, 255, 0.5);
		background: rgba(255, 255, 255, 0.1);
	}

	.play-btn {
		color: #ff1b6b;
	}

	.play-btn:hover {
		color: #fff;
		text-shadow: 0 0 10px rgba(255, 27, 107, 0.5);
		background: rgba(255, 27, 107, 0.1);
	}

	.progress-bar {
		width: 100%;
		height: 3px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 2px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.progress-fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: linear-gradient(to right, #ff1b6b, #45caff);
		transition: width 0.1s linear;
	}
</style>
