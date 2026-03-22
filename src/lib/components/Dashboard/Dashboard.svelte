<script>
	import { onMount } from 'svelte';
	import { Shield, Search, Bell, Settings, Globe, Layers, Radio } from 'lucide-svelte';
	import Map from '../Map/Map.svelte';
	import NewsPanel from '../News/NewsPanel.svelte';
	import InfoPanel from '../Infrastructure/InfoPanel.svelte';
	import RadioPanel from '../Radio/RadioPanel.svelte';
	import SpecialMonitor from '../Special/SpecialMonitor.svelte';
	import ISSGlobe from '../Special/ISSGlobe.svelte';
	import { currentVariant, setVariant } from '../../services/variant-store';

	let currentTime = $state(new Date());
	let btcPrice = $state(0);
	let worldPop = $state(8282730987); // Baseline from Worldometers
	let newsItems = $state([]);
	let marketInterval, newsInterval, popInterval;

	async function fetchBTC() {
		try {
			const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
			const data = await res.json();
			if (data.bitcoin) btcPrice = data.bitcoin.usd;
		} catch (e) {
			console.warn('BTC_FETCH_DELAY', e);
		}
	}

	async function fetchGDACS() {
		try {
			// Fetch from internal proxy to bypass CORS
			const res = await fetch('/api/news');
			const text = await res.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(text, 'text/xml');
			const items = Array.from(doc.querySelectorAll('item')).slice(0, 10);
			newsItems = items.map(item => ({
				title: item.querySelector('title')?.textContent || '',
				desc: item.querySelector('description')?.textContent || ''
			}));
		} catch (e) {
			console.warn('GDACS_PROXY_LINK_FAILURE', e);
		}
	}

	onMount(() => {
		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);
		
		fetchBTC();
		fetchGDACS();
		marketInterval = setInterval(fetchBTC, 60000);
		newsInterval = setInterval(fetchGDACS, 300000);

		// Population Ticker (~2.2 people/sec)
		popInterval = setInterval(() => {
			worldPop += 1;
		}, 450);

		return () => {
			clearInterval(interval);
			if (marketInterval) clearInterval(marketInterval);
			if (newsInterval) clearInterval(newsInterval);
			if (popInterval) clearInterval(popInterval);
		};
	});

	function fmtDate(d) {
		const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
		const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
		return `${days[d.getUTCDay()]}, ${d.getUTCDate().toString().padStart(2,'0')} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()} ${d.toISOString().split('T')[1].split('.')[0]} UTC`;
	}
</script>

<div class="app" style="--accent: {$currentVariant.accent}">
	<!-- ===== TOP BAR ===== -->
	<header class="topbar">
		<div class="tb-left">
			<div class="brand">
				<Shield size={16} />
				<span class="brand-name">WORLDVIEW</span>
			</div>
			<span class="tb-sep">|</span>
			<div class="variant-indicator">{$currentVariant.label}</div>
			<div class="pop-monitor mono">
				<span class="p-label">CURRENT WORLD POPULATION:</span> 
				<span class="p-val">{Math.floor(worldPop).toLocaleString()}</span>
			</div>
		</div>
		<div class="tb-center mono">
			{fmtDate(currentTime)}
		</div>
		<div class="tb-right">
			<div class="variant-switcher">
				<button class:vactive={$currentVariant.id === 'world'} onclick={() => setVariant('world')}>W</button>
				<button class:vactive={$currentVariant.id === 'tech'} onclick={() => setVariant('tech')}>T</button>
				<button class:vactive={$currentVariant.id === 'finance'} onclick={() => setVariant('finance')}>F</button>
				<button class:vactive={$currentVariant.id === 'commodity'} onclick={() => setVariant('commodity')}>C</button>
				<button class:vactive={$currentVariant.id === 'happy'} onclick={() => setVariant('happy')}>H</button>
			</div>
			<span class="tb-sep">|</span>
			<button class="tb-icon"><Search size={14} /></button>
			<button class="tb-icon"><Bell size={14} /><span class="notif-dot"></span></button>
			<button class="tb-icon"><Settings size={14} /></button>
			<span class="tb-sep">|</span>
			<div class="btc-status mono">BTC_USD: <span class="btc-val">${btcPrice.toLocaleString()}</span></div>
			<div class="tb-sep">|</div>
			<span class="op-id mono">OP_7741</span>
		</div>
	</header>

	<!-- ===== MAP & SPACE AREA ===== -->
	<section class="map-area">
		<div class="map-main"><Map /></div>
		<div class="map-side"><ISSGlobe /></div>
	</section>

	<!-- ===== BOTTOM TACTICAL GRID ===== -->
	<section class="bottom-grid">
		<div class="col col-news"><NewsPanel /></div>
		<div class="col col-critical"><SpecialMonitor ytId="gmtlJ_m2r5A" label="24/7 Multiple Cameras in Israel, Iran, Syria and Middle East" /></div>
		<div class="col col-critical"><SpecialMonitor ytId="fO9e9jnhYK8" label="24/7 Livestream of Earth from ISS" /></div>
		<div class="col col-radio"><RadioPanel /></div>
	</section>

	<!-- ===== BOTTOM TICKER ===== -->
	<footer class="ticker">
		<div class="ticker-scroll mono">
			{#each newsItems as item}
				<span class="t-flash">ALERT:</span> {item.title.toUpperCase()}: {item.desc} &nbsp;|&nbsp;
			{/each}
			{#if newsItems.length === 0}
				<span class="t-info">LOADING_GLOBAL_DISASTER_MONITOR...</span>
			{/if}
		</div>
	</footer>
</div>

<style>
	.app {
		height: 100dvh;
		width: 100vw;
		display: grid;
		grid-template-rows: 36px 42vh 1fr 24px;
		background: var(--bg-primary);
		overflow: hidden;
	}

	/* ---- TOP BAR ---- */
	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 12px;
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
		font-size: 0.7rem;
		z-index: 200;
	}
	.tb-left, .tb-right { display: flex; align-items: center; gap: 10px; }
	.tb-center { font-size: 0.65rem; color: var(--text-secondary); letter-spacing: 1px; }
	.brand { display: flex; align-items: center; gap: 6px; font-weight: 900; letter-spacing: 1px; color: var(--accent); }
	.brand-name { font-size: 0.75rem; }
	.tb-sep { color: var(--text-muted); font-size: 0.6rem; }
	
	.variant-indicator { font-size: 0.55rem; font-weight: 900; color: var(--text-secondary); letter-spacing: 1px; }
	
	.variant-switcher { display: flex; gap: 2px; }
	.variant-switcher button {
		background: var(--bg-tertiary); border: 1px solid var(--border);
		color: var(--text-muted); font-size: 0.5rem; font-weight: 900;
		width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
		cursor: pointer; border-radius: 2px;
	}
	.variant-switcher button:hover { color: #fff; border-color: var(--text-muted); }
	.variant-switcher button.vactive { background: var(--accent); color: #000; border-color: var(--accent); }

	.tb-icon {
		background: none; border: none; color: var(--text-secondary);
		cursor: pointer; position: relative; display: flex; align-items: center;
	}
	.notif-dot {
		position: absolute; top: -2px; right: -3px;
		width: 5px; height: 5px; background: var(--danger);
		border-radius: 50%;
	}
	.pop-monitor {
		background: rgba(var(--accent-rgb, 56, 189, 248), 0.1);
		color: var(--text-secondary);
		font-size: 0.55rem;
		font-weight: 900;
		padding: 2px 8px;
		border-radius: 3px;
		border: 1px solid rgba(var(--accent-rgb, 56, 189, 248), 0.2);
		display: flex;
		gap: 6px;
		letter-spacing: 1.5px;
	}
	.p-label { color: var(--accent); opacity: 0.8; }
	.p-val { color: #fff; text-shadow: 0 0 5px var(--accent); }
	.btc-status { font-size: 0.6rem; color: var(--text-secondary); letter-spacing: 0.5px; }
	.btc-val { color: var(--accent); font-weight: 900; }
	.op-id { font-size: 0.6rem; color: var(--accent); }

	/* ---- MAP ---- */
	.map-area {
		position: relative;
		overflow: hidden;
		background: #000;
		display: grid;
		grid-template-columns: 66% 34%;
	}
	.map-main, .map-side { position: relative; height: 100%; overflow: hidden; }
	.map-side { border-left: 1px solid var(--border); }

	/* ---- BOTTOM GRID ---- */
	.bottom-grid {
		display: grid;
		grid-template-columns: 25% 25% 25% 25%;
		border-top: 1px solid var(--border);
		overflow: hidden;
	}
	.col {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-right: 1px solid var(--border);
		background: var(--bg-panel);
	}
	.col:last-child { border-right: none; }

	/* ---- TICKER ---- */
	.ticker {
		background: #000;
		display: flex;
		align-items: center;
		overflow: hidden;
		border-top: 1px solid var(--border);
	}
	.ticker-scroll {
		white-space: nowrap;
		font-size: 0.6rem;
		color: var(--text-secondary);
		animation: scroll-x 180s linear infinite;
		padding-left: 100%;
	}
	.t-flash { color: var(--warning); font-weight: 900; }
	.t-danger { color: var(--danger); font-weight: 900; }
	.t-info { color: var(--accent); font-weight: 900; }
	.t-warn { color: var(--warning); font-weight: 900; }

	@keyframes scroll-x {
		from { transform: translateX(0); }
		to { transform: translateX(-100%); }
	}

	@media (max-width: 900px) {
		.bottom-grid { grid-template-columns: 1fr 1fr; }
		.col-alerts, .col-insights { display: none; }
	}
</style>
