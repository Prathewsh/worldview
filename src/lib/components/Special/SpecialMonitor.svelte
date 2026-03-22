<script>
	import { Radio, ExternalLink, Maximize2 } from 'lucide-svelte';
	
	let { ytId = 'gmtlJ_m2r5A', label = 'CRITICAL MONITOR' } = $props();

	function getEmbedUrl(id) {
		return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`;
	}
</script>

<div class="sm">
	<div class="sm-header">
		<div class="sm-title"><Radio size={12} class="pulse-red" /> {label}</div>
		<div class="sm-btns">
			<a href="https://youtube.com/watch?v={ytId}" target="_blank" class="sm-btn"><ExternalLink size={10} /></a>
		</div>
	</div>
	<div class="vid-container">
		<iframe 
			src={getEmbedUrl(ytId)} 
			title={label}
			frameborder="0" 
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure" 
			allowfullscreen
			class="yt-frame"
		></iframe>
		<div class="vid-overlay">
			<div class="scanline"></div>
			<div class="corner tl"></div>
			<div class="corner tr"></div>
			<div class="corner bl"></div>
			<div class="corner br"></div>
		</div>
	</div>
	<div class="sm-footer mono">
		<span class="status">SIGNAL: ENCRYPTED</span>
		<span class="bitrate">8.4 Mbps</span>
	</div>
</div>

<style>
	.sm {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #000;
		overflow: hidden;
	}
	.sm-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 6px 10px;
		background: rgba(255,255,255,0.03);
		border-bottom: 1px solid var(--border);
	}
	.sm-title { font-size: 0.6rem; font-weight: 900; letter-spacing: 1px; color: var(--danger); display: flex; align-items: center; gap: 6px; }
	
	.vid-container {
		flex: 1;
		position: relative;
		overflow: hidden;
	}
	.yt-frame {
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.vid-overlay {
		position: absolute; top:0; left:0; width:100%; height:100%;
		pointer-events: none;
		border: 1px solid rgba(239, 68, 68, 0.1);
	}
	.scanline {
		width: 100%; height: 2px; background: rgba(255,255,255,0.05);
		position: absolute; top: 0; animation: scan 4s linear infinite;
	}
	@keyframes scan { from { top: 0% } to { top: 100% } }

	.corner { position: absolute; width: 6px; height: 6px; border-color: var(--danger); border-style: solid; opacity: 0.5; }
	.tl { top: 10px; left: 10px; border-width: 1px 0 0 1px; }
	.tr { top: 10px; right: 10px; border-width: 1px 1px 0 0; }
	.bl { bottom: 10px; left: 10px; border-width: 0 0 1px 1px; }
	.br { bottom: 10px; right: 10px; border-width: 0 1px 1px 0; }

	.sm-footer {
		padding: 4px 10px;
		background: rgba(0,0,0,0.5);
		display: flex;
		justify-content: space-between;
		font-size: 0.45rem;
		color: var(--text-muted);
		border-top: 1px solid var(--border);
	}

	:global(.pulse-red) { color: var(--danger); animation: p-red 1.5s infinite alternate; }
	@keyframes p-red { from { opacity: 0.4; } to { opacity: 1; } }
</style>
