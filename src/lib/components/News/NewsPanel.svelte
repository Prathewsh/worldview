<script>
	import { onMount, onDestroy } from 'svelte';
	import { Tv, Play, Search, Volume2, Maximize } from 'lucide-svelte';
	import Hls from 'hls.js';

	const M3U_URL = 'https://iptv-org.github.io/iptv/categories/news.m3u';

	let channels = $state([]);
	let filteredChannels = $state([]);
	let searchQuery = $state('');
	let selectedChannel = $state(null);
	let videoElement = $state();
	let hls;
	let isLoading = $state(true);
	let isMuted = $state(true);

	// Quick-access tabs matching the reference image
	const quickTabs = ['BBC ASIA', 'ABC NEWS', 'NEWS 24', 'BLOOMBERG', 'CNN', 'AL JAZEERA'];
	let activeTab = $state('BBC ASIA');

	onMount(async () => {
		try {
			const res = await fetch(M3U_URL);
			const text = await res.text();
			channels = parseM3U(text);
			filteredChannels = channels;
			isLoading = false;
			
			// Set BBC ASIA as default
			selectTab('BBC ASIA');
		} catch (e) {
			console.error('Failed to fetch M3U:', e);
			isLoading = false;
		}
	});

	function parseM3U(text) {
		const lines = text.split('\n');
		const result = [];
		let cur = {};
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();
			if (line.startsWith('#EXTINF:')) {
				const nameMatch = line.match(/tvg-name="([^"]*)"/);
				const logoMatch = line.match(/tvg-logo="([^"]*)"/);
				const name = line.split(',').pop();
				cur = {
					name: name || nameMatch?.[1] || 'Unknown',
					logo: logoMatch?.[1] || null,
					id: Math.random().toString(36).substr(2, 9)
				};
			} else if (line.startsWith('http')) {
				cur.url = line;
				result.push(cur);
				cur = {};
			}
		}
		return result;
	}

	function selectTab(tabName) {
		activeTab = tabName;
		let searchId = tabName.toUpperCase().replace(/\s/g, '');
		
		// Priority manual mapping
		if (tabName === 'NEWS 24') searchId = '24NEWS';
		if (tabName === 'BBC ASIA') searchId = 'BBCNEWSASIAPACIFIC';

		// Find all partial matches
		const matches = channels.filter(c => c.name.toUpperCase().replace(/\s/g, '').includes(searchId));
		
		// Prioritize English/World versions and resolution tags
		const priorityMatch = matches.find(c => 
			(c.name.toUpperCase().includes('1080P') || c.name.toUpperCase().includes('576P')) &&
			(c.name.toUpperCase().includes('ENGLISH') || c.name.toUpperCase().includes(' EN') || c.name.toUpperCase().includes('WORLD') || c.name.toUpperCase().includes('PACIFIC'))
		);

		if (priorityMatch) {
			selectedChannel = priorityMatch;
		} else if (matches.length > 0) {
			selectedChannel = matches[0];
		}
	}

	$effect(() => {
		if (searchQuery) {
			filteredChannels = channels.filter(c =>
				c.name.toLowerCase().includes(searchQuery.toLowerCase())
			);
		} else {
			filteredChannels = channels;
		}
	});

	$effect(() => {
		if (selectedChannel && videoElement) {
			playChannel(selectedChannel);
		}
	});

	function playChannel(channel) {
		if (hls) hls.destroy();
		if (Hls.isSupported()) {
			hls = new Hls();
			hls.loadSource(channel.url);
			hls.attachMedia(videoElement);
			hls.on(Hls.Events.MANIFEST_PARSED, () => {
				videoElement.play().catch(() => {});
			});
		} else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
			videoElement.src = channel.url;
			videoElement.addEventListener('loadedmetadata', () => videoElement.play());
		}
	}

	onDestroy(() => { if (hls) hls.destroy(); });
</script>

<div class="np">
	<!-- Panel Header -->
	<div class="np-header">
		<div class="np-title"><Tv size={12} /> LIVE NEWS</div>
		<div class="np-live"><span class="live-dot"></span>LIVE</div>
	</div>

	<!-- Channel Quick Tabs -->
	<div class="tab-row">
		{#each quickTabs as tab}
			<button class="qtab" class:active={activeTab === tab}
				onclick={() => selectTab(tab)}>{tab}</button>
		{/each}
	</div>

	<!-- Video Player -->
	<div class="video-box" onclick={() => isMuted = !isMuted}>
		{#if selectedChannel}
			<video bind:this={videoElement} class="vid" playsinline muted={isMuted}></video>
			<div class="vid-overlay" class:visible={isMuted}>
				<div class="vid-info">
					<span class="vid-name">{selectedChannel.name}</span>
					<button class="mute-btn">
						{#if isMuted}
							<div class="unmute-req"><Volume2 size={12} /> CLICK TO UNMUTE</div>
						{:else}
							<Volume2 size={12} />
						{/if}
					</button>
				</div>
			</div>
		{:else if isLoading}
			<div class="vid-loading mono">DECRYPTING FEEDS...</div>
		{:else}
			<div class="vid-loading">NO FEED</div>
		{/if}
	</div>

	<!-- Search -->
	<div class="ch-search">
		<Search size={12} />
		<input type="text" placeholder="Filter channels..." bind:value={searchQuery} />
	</div>

	<!-- Channel List (SCROLLABLE) -->
	<div class="ch-list">
		{#each filteredChannels as channel (channel.id)}
			<button class="ch-item" class:active={selectedChannel?.id === channel.id}
				onclick={() => selectedChannel = channel}>
				<div class="ch-thumb">
					{#if channel.logo}
						<img src={channel.logo} alt="" loading="lazy" />
					{:else}
						<Play size={12} />
					{/if}
				</div>
				<span class="ch-name">{channel.name}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.np {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}
	.np-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 6px 10px;
		background: rgba(255,255,255,0.02);
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
	}
	.np-title { font-size: 0.6rem; font-weight: 800; letter-spacing: 1px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; }
	.np-live { font-size: 0.55rem; font-weight: 800; color: var(--danger); display: flex; align-items: center; gap: 4px; }
	.live-dot { width: 5px; height: 5px; background: var(--danger); border-radius: 50%; animation: blink 1.5s infinite; }
	@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

	.tab-row {
		display: flex;
		gap: 2px;
		padding: 4px 6px;
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
		overflow-x: auto;
	}
	.qtab {
		background: none; border: none; color: var(--text-muted);
		font-size: 0.5rem; font-weight: 800; padding: 3px 6px;
		cursor: pointer; border-radius: 2px; white-space: nowrap;
	}
	.qtab.active, .qtab:hover { background: rgba(56,189,248,0.12); color: var(--accent); }

	.video-box {
		position: relative;
		width: 100%;
		aspect-ratio: 16/9;
		background: #000;
		flex-shrink: 0;
		min-height: 220px;
	}
	.vid { width: 100%; height: 100%; object-fit: contain; }
	.vid-overlay {
		position: absolute; bottom: 0; left: 0; right: 0;
		padding: 6px 10px;
		background: linear-gradient(transparent, rgba(0,0,0,0.9));
		opacity: 0;
		transition: opacity 0.2s;
		pointer-events: none;
	}
	.video-box:hover .vid-overlay, .vid-overlay.visible { opacity: 1; pointer-events: auto; }
	.vid-info { display: flex; justify-content: space-between; align-items: center; width: 100%; }
	.vid-name { font-size: 0.6rem; font-weight: 700; color: #fff; }
	.mute-btn {
		background: var(--accent);
		color: #000;
		border: none;
		border-radius: 3px;
		padding: 3px 6px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.5rem;
		font-weight: 900;
	}
	.unmute-req { display: flex; align-items: center; gap: 5px; animation: pulse 1s infinite alternate; }
	@keyframes pulse { from { opacity: 0.7; } to { opacity: 1; } }
	.vid-loading { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 0.65rem; color: var(--text-muted); }

	.ch-search {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 5px 8px;
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
		color: var(--text-muted);
	}
	.ch-search input {
		background: none; border: none; outline: none;
		color: var(--text-primary); font-size: 0.65rem; width: 100%;
	}

	/* THIS IS THE KEY: flex-grow + min-height 0 + overflow-y auto */
	.ch-list {
		flex: 1 1 0;
		min-height: 0;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1px;
		padding: 4px;
	}

	.ch-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 5px 6px;
		background: none;
		border: 1px solid transparent;
		border-radius: 3px;
		cursor: pointer;
		color: var(--text-primary);
		text-align: left;
		flex-shrink: 0;
	}
	.ch-item:hover { background: rgba(255,255,255,0.04); }
	.ch-item.active { background: rgba(56,189,248,0.08); border-color: rgba(56,189,248,0.2); }

	.ch-thumb {
		width: 28px; height: 28px;
		border-radius: 3px;
		background: var(--bg-tertiary);
		display: flex; align-items: center; justify-content: center;
		overflow: hidden; flex-shrink: 0;
	}
	.ch-thumb img { width: 100%; height: 100%; object-fit: cover; }
	.ch-name { font-size: 0.6rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
