<script>
	import { Camera, ExternalLink } from 'lucide-svelte';

	let activeRegion = $state('ASIA');
	const regions = ['ALL','MIDEAST','EUROPE','AMERICAS','ASIA'];

	const cameras = {
		ASIA: [
			{ label: 'TOKYO_SHIBUYA', ytId: '6v_Nog1tA_s' },
			{ label: 'SEOUL_LIVE', ytId: 'n662L0y66XU' },
			{ label: 'TAIPEI_CENTRAL', ytId: 'V_V-T_P0m98' },
			{ label: 'BANGKOK_STREET', ytId: 'pSAszIKT0is' },
		],
		EUROPE: [
			{ label: 'LONDON_ABBEY', ytId: '2O9V1O8qVRE' },
			{ label: 'VENICE_CANAL', ytId: 'HpZAez2oYS0' },
			{ label: 'PRAGUE_SQUARE', ytId: 'OqfH5P1f48M' },
			{ label: 'BERLIN_MITTE', ytId: 'hpXU6eYI_mU' },
		],
		AMERICAS: [
			{ label: 'NYC_TIMES_SQ', ytId: '1-iS7LArMPA' },
			{ label: 'LA_BEACH', ytId: 'a09XnyI980s' },
			{ label: 'TORONTO_CITY', ytId: 'u8L-G0722rA' },
			{ label: 'MIAMI_OCEAN', ytId: '9v8LUVm49wY' },
		],
		MIDEAST: [
			{ label: 'JERUSALEM', ytId: 'Ff6pntYAtWk' },
			{ label: 'ISTANBUL_BOSPORUS', ytId: 'w_06p-8W7XU' },
			{ label: 'KUWAIT_CITY', ytId: 'Y-V79V1qV88' },
			{ label: 'DUBAI_MARINA', ytId: 'V9V-V5V-V9V' }, // Placeholder
		],
		ALL: []
	};

	// Combine all
	cameras.ALL = [...cameras.ASIA, ...cameras.EUROPE, ...cameras.AMERICAS, ...cameras.MIDEAST];

	function getEmbedUrl(id) {
		return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0`;
	}
</script>

<div class="cp">
	<div class="cp-header">
		<span class="cp-title"><Camera size={12} /> LIVE TACTICAL FEEDS</span>
	</div>
	<div class="region-tabs">
		{#each regions as r}
			<button class="rtab" class:active={activeRegion === r}
				onclick={() => activeRegion = r}>{r}</button>
		{/each}
	</div>
	<div class="cam-grid">
		{#each (cameras[activeRegion] || []) as cam}
			<div class="cam-cell">
				<iframe 
					src={getEmbedUrl(cam.ytId)} 
					title={cam.label}
					frameborder="0" 
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
					allowfullscreen
					class="yt-embed"
				></iframe>
				<div class="cam-overlay">
					<div class="cam-label mono">{cam.label}</div>
					<div class="cam-live">LIVE_SIGNAL</div>
					<a href="https://youtube.com/watch?v={cam.ytId}" target="_blank" class="cam-link">
						<ExternalLink size={8} />
					</a>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.cp {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}
	.cp-header {
		display: flex;
		align-items: center;
		padding: 6px 10px;
		background: rgba(255,255,255,0.02);
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
	}
	.cp-title { font-size: 0.6rem; font-weight: 800; letter-spacing: 1px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; }

	.region-tabs {
		display: flex;
		gap: 2px;
		padding: 4px 8px;
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
	}
	.rtab {
		background: none; border: none; color: var(--text-muted);
		font-size: 0.5rem; font-weight: 800; padding: 3px 8px;
		cursor: pointer; border-radius: 2px;
	}
	.rtab.active { background: rgba(56,189,248,0.12); color: var(--accent); }

	.cam-grid {
		flex: 1 1 0;
		min-height: 0;
		overflow-y: auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3px;
		padding: 4px;
		align-content: start;
	}

	.cam-cell {
		position: relative;
		aspect-ratio: 16/9;
		background: #000;
		border-radius: 2px;
		overflow: hidden;
	}
	.yt-embed {
		width: 100%;
		height: 100%;
		opacity: 0.8;
		transition: opacity 0.3s;
		pointer-events: none; /* Allows hover on overlay */
	}
	.cam-cell:hover .yt-embed { opacity: 1; }

	.cam-overlay {
		position: absolute;
		top: 0; left: 0; right: 0; bottom: 0;
		padding: 5px;
		pointer-events: none;
	}
	
	.cam-label {
		position: absolute; top: 4px; left: 4px;
		font-size: 0.45rem; font-weight: 800;
		background: rgba(0,0,0,0.65); padding: 1px 4px;
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 2px;
		color: #fff;
	}
	.cam-live {
		position: absolute; top: 4px; right: 4px;
		font-size: 0.4rem; font-weight: 900;
		background: var(--danger); color: white;
		padding: 0px 3px; border-radius: 2px;
		letter-spacing: 0.5px;
	}
	.cam-link {
		position: absolute; bottom: 4px; right: 4px;
		color: var(--text-muted);
		pointer-events: initial;
		opacity: 0.5;
	}
	.cam-link:hover { color: var(--accent); opacity: 1; }
</style>
