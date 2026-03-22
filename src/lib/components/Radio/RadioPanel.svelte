<script>
	import { onMount } from 'svelte';
	import { Radio, Play, Square, Volume2, Globe } from 'lucide-svelte';

	let stations = $state([]);
	let activeStation = $state(null);
	let audioEl;
	let isPlaying = $state(false);
	let playbackError = $state(false);

	async function fetchStations() {
		try {
			// Proxy fetch to bypass CORS
			const res = await fetch('/api/radio');
			stations = (await res.json()).slice(0, 30);
		} catch (e) {
			console.error('Radio API Proxy Failure:', e);
		}
	}

	function togglePlayback() {
		if (!audioEl) return;
		if (isPlaying) {
			audioEl.pause();
		} else if (activeStation) {
			audioEl.play().catch(e => console.warn('PLAYBACK_BLOCKED', e));
		}
	}

	function playStation(station) {
		playbackError = false;
		if (activeStation?.stationuuid === station.stationuuid) {
			togglePlayback();
		} else {
			activeStation = station;
			isPlaying = false;
			const streamUrl = station.url_resolved || station.url;
			audioEl.src = streamUrl;
			audioEl.load();
			audioEl.play().catch(err => {
				console.error('Signal Failure:', err);
				playbackError = true;
			});
		}
	}

	onMount(fetchStations);
</script>

<div class="rp">
	<audio 
		bind:this={audioEl} 
		onplay={() => isPlaying = true} 
		onpause={() => isPlaying = false}
		onerror={() => playbackError = true}
	></audio>

	<header class="rp-header">
		<span class="rp-title"><Radio size={12} class="pulse-sig" /> RADIO_DECK</span>
		{#if playbackError}
			<div class="error-badge mono">SIGNAL_DEAD</div>
		{:else if isPlaying}
			<div class="active-badge mono">LOCK_ON</div>
		{/if}
	</header>

	<div class="station-list">
		{#each stations as s}
			<button class="station-row" class:active={activeStation?.stationuuid === s.stationuuid}
				onclick={() => playStation(s)}>
				<div class="s-info">
					<div class="s-name mono">{s.name}</div>
					<div class="s-metadata mono">{s.countrycode} | {Math.round(s.bitrate || 0)}kbps</div>
				</div>
				<div class="s-action">
					{#if activeStation?.stationuuid === s.stationuuid && isPlaying}
						<Square size={10} fill="currentColor" class="pause-icon" />
					{:else}
						<Play size={10} fill="currentColor" />
					{/if}
				</div>
			</button>
		{/each}
	</div>

	<footer class="rp-footer">
		{#if activeStation}
			<div class="tuned-info mono">SIGNAL_TUNED: {Math.round((activeStation.bitrate || 128)/10)}%</div>
		{:else}
			<div class="tuned-info mono text-muted">AWAITING_SIGNAL_LOCK</div>
		{/if}
		<div class="network-status mono">SAT_COM_LINK_OK</div>
	</footer>
</div>

<style>
	.rp {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--bg-panel);
		overflow: hidden;
	}
	.rp-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 12px;
		background: rgba(255,255,255,0.02);
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
	}
	.rp-title { font-size: 0.6rem; font-weight: 900; color: var(--accent); display: flex; align-items: center; gap: 8px; letter-spacing: 1px; }
	
	.active-badge { font-size: 0.5rem; background: var(--success); color: #000; padding: 2px 6px; border-radius: 2px; font-weight: 800; animation: glow 2s infinite alternate; }
	.error-badge { font-size: 0.5rem; background: var(--danger); color: #fff; padding: 2px 6px; border-radius: 2px; font-weight: 800; }
	
	@keyframes glow { from { box-shadow: 0 0 2px var(--success); } to { box-shadow: 0 0 10px var(--success); } }

	.station-list {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		scrollbar-width: thin;
		scrollbar-color: var(--border) transparent;
	}
	.station-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 12px;
		border: none;
		border-bottom: 1px solid rgba(255,255,255,0.03);
		background: none;
		cursor: pointer;
		color: var(--text-secondary);
		transition: all 0.2s;
		text-align: left;
		width: 100%;
	}
	.station-row:hover { background: rgba(255,255,255,0.02); color: #fff; }
	.station-row.active { background: rgba(var(--accent-rgb, 56, 189, 248), 0.1); color: var(--accent); border-left: 2px solid var(--accent); }
	
	.s-name { font-size: 0.65rem; font-weight: 700; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.s-metadata { font-size: 0.5rem; color: var(--text-muted); letter-spacing: 0.5px; }
	
	.s-action { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; opacity: 0.4; }
	.station-row:hover .s-action, .station-row.active .s-action { opacity: 1; }
	.pause-icon { color: var(--success); }

	.rp-footer {
		padding: 6px 12px;
		background: rgba(0,0,0,0.2);
		border-top: 1px solid var(--border);
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-shrink: 0;
	}
	
	.tuned-info { font-size: 0.5rem; color: var(--accent); letter-spacing: 0.5px; font-weight: 700; }
	.network-status { font-size: 0.5rem; color: var(--success); opacity: 0.7; letter-spacing: 1px; }
	
	:global(.pulse-sig) { animation: p-sig 1.5s infinite alternate; }
	@keyframes p-sig { from { opacity: 0.4; } to { opacity: 1; } }
</style>
