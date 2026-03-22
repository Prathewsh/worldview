<script>
	import { onMount, onDestroy } from 'svelte';
	import { Globe as GlobeIcon, Crosshair } from 'lucide-svelte';

	let globeContainer;
	let globe;
	let issTargetPos = { lat: 0, lng: 0 };
	let currentIssPos = $state({ lat: 0, lng: 0 });
	let interval;
	let raf;

	async function fetchISS() {
		try {
			const res = await fetch('http://api.open-notify.org/iss-now.json');
			const data = await res.json();
			issTargetPos = {
				lat: parseFloat(data.iss_position.latitude),
				lng: parseFloat(data.iss_position.longitude)
			};
			if (currentIssPos.lat === 0) {
				currentIssPos = { ...issTargetPos };
			}
		} catch (e) {
			console.error('ISS Fetch Error:', e);
		}
	}

	const issObjData = [{ lat: 0, lng: 0, name: 'ISS_STATION' }];

	function animate() {
		if (issTargetPos.lat !== 0) {
			const lerp = 0.05;
			currentIssPos.lat += (issTargetPos.lat - currentIssPos.lat) * lerp;
			currentIssPos.lng += (issTargetPos.lng - currentIssPos.lng) * lerp;

			if (globe) {
				issObjData[0].lat = currentIssPos.lat;
				issObjData[0].lng = currentIssPos.lng;
				globe.objectsData(issObjData);
			}
		}
		raf = requestAnimationFrame(animate);
	}

	onMount(async () => {
		const Globe = (await import('globe.gl')).default;
		const THREE = await import('three');
		const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader');
		
		const width = globeContainer.clientWidth || 300;
		const height = globeContainer.clientHeight || 300;

		const loader = new GLTFLoader();
		const issModel = await new Promise(resolve => {
			loader.load('/international_space_station_iss.glb', (gltf) => {
				const scene = gltf.scene;
				scene.scale.set(4, 4, 4); // Slightly larger for tactical visibility
				// Tactical Glow
				scene.traverse(child => {
					if (child.isMesh) {
						child.material.emissive = new THREE.Color('#38bdf8');
						child.material.emissiveIntensity = 0.2;
					}
				});
				resolve(scene);
			});
		});

		// Silence library-internal Three.js deprecation noise (THREE.Clock)
		const originalWarn = console.warn;
		console.warn = (...args) => {
			if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return;
			originalWarn(...args);
		};

		globe = Globe()(globeContainer)
			.globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
			.backgroundColor('rgba(0,0,0,0)')
			.width(width)
			.height(height)
			.showAtmosphere(true)
			.atmosphereColor('#38bdf8')
			.objectLat('lat')
			.objectLng('lng')
			.objectAltitude(0.18) 
			.objectLabel('name')
			.objectThreeObject(() => issModel.clone());

		console.warn = originalWarn; // Restore telemetry logging

		const scene = globe.scene();
		scene.add(new THREE.AmbientLight(0xffffff, 2.0));
		const sun = new THREE.DirectionalLight(0xffffff, 3);
		sun.position.set(1, 1, 1);
		scene.add(sun);

		await fetchISS();
		if (currentIssPos.lat !== 0) {
			globe.pointOfView({ lat: currentIssPos.lat, lng: currentIssPos.lng, altitude: 1.4 });
		}

		interval = setInterval(fetchISS, 5000); // Optimized polling
		raf = requestAnimationFrame(animate);

		const resize = () => {
			if (globe && globeContainer) {
				globe.width(globeContainer.clientWidth).height(globeContainer.clientHeight);
			}
		};
		window.addEventListener('resize', resize);
		
		return () => {
			clearInterval(interval);
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
			if (globe) globe._destructor();
		};
	});
</script>

<div class="iss-monitor">
	<div class="monitor-header">
		<div class="m-title"><GlobeIcon size={12} class="pulse-blue" /> ISS ORBITAL TRACKER</div>
		<div class="m-stats mono">
			TRACKING: {currentIssPos.lat.toFixed(4)}N / {currentIssPos.lng.toFixed(4)}E
		</div>
	</div>
	<div class="globe-viewport" bind:this={globeContainer}></div>
	<div class="monitor-footer">
		<div class="status mono"><span class="dot"></span> INTERPOLATION_ACTIVE</div>
		<Crosshair size={10} class="target-icon" />
	</div>
</div>

<style>
	.iss-monitor {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #000;
		position: relative;
		overflow: hidden;
		border-left: 1px solid var(--border);
	}
	.monitor-header {
		display: flex;
		justify-content: space-between;
		padding: 8px 12px;
		background: rgba(255,255,255,0.02);
		border-bottom: 1px solid var(--border);
		z-index: 10;
	}
	.m-title { font-size: 0.6rem; font-weight: 900; color: #38bdf8; display: flex; align-items: center; gap: 8px; letter-spacing: 1px; }
	.m-stats { font-size: 0.55rem; color: var(--text-muted); letter-spacing: 1px; }
	
	.globe-viewport {
		flex: 1;
		width: 100%;
		cursor: crosshair;
	}

	.monitor-footer {
		position: absolute; bottom: 8px; left: 0; width: 100%;
		display: flex; justify-content: space-between; align-items: center;
		padding: 0 12px; pointer-events: none;
	}
	.status { font-size: 0.5rem; color: var(--success); display: flex; align-items: center; gap: 6px; }
	.dot { width: 4px; height: 4px; background: var(--success); border-radius: 50%; animation: blink 1s infinite; }
	@keyframes blink { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
	
	.target-icon { color: var(--text-muted); opacity: 0.5; }

	:global(.pulse-blue) { color: #38bdf8; animation: p-blue 2s infinite alternate; }
	@keyframes p-blue { from { opacity: 0.5; } to { opacity: 1; } }
</style>
