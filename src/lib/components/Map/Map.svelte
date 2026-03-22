<script>
	import { onMount, onDestroy } from 'svelte';
	import { Layers, Map as MapIcon, Shield, Radio, Activity } from 'lucide-svelte';
	import { currentVariant } from '../../services/variant-store';
	import { DATA_LAYERS } from '../../services/data-sources';

	let mapContainer;
	let l; // Leaflet instance

	// Dynamic accent from variant
	let accent = $derived($currentVariant.accent);

	let signals = $state([]);
	let refreshInterval;
	let markerGroup; // Isolated layer for signals to prevent DOM thrashing

	async function fetchLiveData() {
		let newSignals = [];
		
		try {
			const usgsRes = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
			const usgsData = await usgsRes.json();
			const seismic = usgsData.features.map(f => ({
				lat: f.geometry.coordinates[1],
				lng: f.geometry.coordinates[0],
				size: Math.max(3, (f.properties.mag || 1) * 2),
				label: `SEISMIC: ${f.properties.title}`,
				color: f.properties.mag > 4.5 ? '#ef4444' : '#f59e0b'
			}));
			newSignals = [...newSignals, ...seismic];
		} catch (e) {
			console.warn('USGS_CHANNEL_OFFLINE', e);
		}

		signals = newSignals;
		updateMarkers();
	}

	function updateMarkers() {
		if (!l || !markerGroup) return;
		
		markerGroup.clearLayers(); // Atomic wipe, no iteration overhead

		signals.forEach(p => {
			L.circleMarker([p.lat, p.lng], {
				radius: p.size,
				color: p.color || accent,
				weight: 1.5,
				fillOpacity: 0.7,
				className: 'tactical-marker'
			}).bindTooltip(p.label, { className: 'map-tooltip', sticky: true }).addTo(markerGroup);
		});
	}

	async function initMap() {
		if (typeof window === 'undefined' || !mapContainer) return;

		try {
			const L = (await import('leaflet')).default;
			if (l) l.remove();
			
			l = L.map(mapContainer, {
				center: [20, 0],
				zoom: 2,
				zoomControl: false,
				attributionControl: false
			});

			markerGroup = L.layerGroup().addTo(l); // Initialize isolation layer

			L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png').addTo(l);
			
			await fetchLiveData();

		} catch (e) {
			console.error('Map initialization failure:', e);
		}
	}

	onMount(() => {
		initMap();
		refreshInterval = setInterval(fetchLiveData, 5000); // 5s refresh as requested
	});

	$effect(() => {
		accent; // trigger on variant change
		updateMarkers();
	});

	onDestroy(() => {
		if (l) l.remove();
	});
</script>

<div class="map-theater">
	<div bind:this={mapContainer} class="map-engine-container"></div>
	
	<!-- Map Overlays -->
	<div class="map-hud hud-top-left glass">
		<header class="hud-header">
			<Shield size={12} style="color: {accent}" />
			<span>THEATER STATUS</span>
		</header>
		<div class="hud-body mono">
			<div class="hud-row"><span>SENSORS</span><span class="ok">1,402 ONLINE</span></div>
			<div class="hud-row"><span>SIGINT</span><span class="ok">OPTIMAL</span></div>
			<div class="hud-row"><span>GEOLOC</span><span class="warning">LOCKED</span></div>
		</div>
	</div>

	<div class="map-hud hud-top-right glass">
		<div class="hud-row"><span class="label">COORD</span><span class="mono">25.3°N, 55.4°E</span></div>
		<div class="hud-row"><span class="label">FOV</span><span class="mono">GLOBAL_2D</span></div>
	</div>

	<div class="map-hud hud-bottom-left glass">
		<header class="hud-header">SEISMIC_LEGEND</header>
		<div class="hud-body mono">
			<div class="legend-item"><span class="dot d-high"></span> <span>MAG 4.5+ CRITICAL</span></div>
			<div class="legend-item"><span class="dot d-low"></span> <span>MAG &lt; 4.5 MONITOR</span></div>
			<div class="legend-item"><span class="dot d-size"></span> <span>SIZE ∝ MAGNITUDE</span></div>
		</div>
	</div>

	<div class="map-hud hud-bottom-right glass">
		<div class="signal-convergence">
			<header class="hud-header"><Radio size={12} /> SIGNALS</header>
			<div class="sig-val">
				<Activity size={10} class="pulse-sig" />
				<span class="mono">ESCALATION: 41.4%</span>
			</div>
		</div>
	</div>
</div>

<style>
	.map-theater {
		width: 100%;
		height: 100%;
		position: relative;
		background: #000;
		overflow: hidden;
	}
	.map-engine-container {
		width: 100%;
		height: 100%;
		cursor: crosshair;
		z-index: 1;
	}

	.map-hud {
		position: absolute;
		z-index: 1000;
		padding: 8px 12px;
		background: rgba(10, 11, 13, 0.85);
		border: 1px solid var(--border);
		backdrop-filter: blur(10px);
		border-radius: 4px;
	}
	.hud-header {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.55rem;
		font-weight: 900;
		color: var(--text-secondary);
		border-bottom: 1px solid var(--border);
		padding-bottom: 4px;
		margin-bottom: 6px;
		letter-spacing: 1px;
	}

	.hud-top-left { top: 12px; left: 12px; min-width: 130px; }
	.hud-bottom-left { bottom: 12px; left: 12px; min-width: 140px; }
	.hud-top-right { top: 12px; right: 12px; display: flex; flex-direction: column; gap: 4px; }
	.hud-bottom-right { bottom: 12px; right: 12px; }

	.legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.5rem; margin-bottom: 4px; color: var(--text-secondary); }
	.dot { width: 6px; height: 6px; border-radius: 50%; box-shadow: 0 0 5px currentColor; }
	.d-high { background: #ef4444; color: #ef4444; }
	.d-low { background: #f59e0b; color: #f59e0b; }
	.d-size { border: 1px solid #fff; background: none; }

	.hud-row { display: flex; justify-content: space-between; gap: 10px; font-size: 0.6rem; color: #cbd5e1; }
	.hud-row span:first-child { color: var(--text-muted); font-weight: 800; font-size: 0.5rem; }
	.ok { color: var(--success); }
	.warning { color: var(--warning); }

	.sig-val { display: flex; align-items: center; gap: 6px; font-size: 0.6rem; font-weight: 900; color: var(--accent); }
	:global(.pulse-sig) { animation: pulse 1s infinite alternate; }
	@keyframes pulse { from { opacity: 0.5; } to { opacity: 1; } }

	:global(.tactical-marker) {
		filter: drop-shadow(0 0 4px var(--accent));
	}
	:global(.map-tooltip) {
		background: rgba(10, 11, 13, 0.95);
		border: 1px solid var(--border);
		color: #fff;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.5rem;
		padding: 4px 8px;
		border-radius: 2px;
		box-shadow: 0 0 10px rgba(0,0,0,0.5);
	}

	@media (max-width: 768px) {
		.hud-top-right, .hud-bottom-right { 
			display: none; 
		}
		.map-hud {
			padding: 4px 8px;
		}
		.hud-top-left { top: 6px; left: 6px; min-width: 110px; }
		.hud-bottom-left { bottom: 6px; left: 6px; min-width: 120px; }
	}
</style>
