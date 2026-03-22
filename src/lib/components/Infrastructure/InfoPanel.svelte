<script>
	import { onMount } from 'svelte';
	import { AlertTriangle, TrendingUp, TrendingDown, Target } from 'lucide-svelte';

	let articles = $state([]);
	let isLoading = $state(true);

	let indices = $state([
		{ label: 'India', value: 84, trend: 0.12 },
		{ label: 'Pakistan', value: 42, trend: -0.31 },
		{ label: 'China', value: 72, trend: 0.05 },
		{ label: 'US', value: 91, trend: 0.08 },
	]);

	async function fetchNews() {
		try {
			const res = await fetch('/api/gdelt?query=conflict OR geopolitics OR military&max=10');
			const data = await res.json();
			if (data?.articles) {
				articles = data.articles.map(a => ({
					title: a.title,
					url: a.url,
					source: a.domain || 'Unknown',
					date: a.seendate ? a.seendate.substring(0, 8) : ''
				}));
			}
		} catch(e) { console.error('GDELT error:', e); }
		isLoading = false;
	}

	onMount(() => {
		fetchNews();
		const i1 = setInterval(fetchNews, 120000);
		const i2 = setInterval(() => {
			indices = indices.map(idx => ({
				...idx,
				value: Math.max(10, Math.min(99, idx.value + (Math.random()-0.5)*0.4)),
				trend: (Math.random()-0.5)*0.3
			}));
		}, 5000);
		return () => { clearInterval(i1); clearInterval(i2); };
	});
</script>

<div class="ip">
	<div class="ip-header">
		<span class="ip-title"><Target size={12} /> AI INSIGHTS</span>
		<span class="ip-live">LIVE</span>
	</div>

	<!-- News feed -->
	<div class="feed">
		{#if isLoading}
			<div class="loading mono">LOADING FEED...</div>
		{:else}
			{#each articles as art, i}
				<a href={art.url} target="_blank" class="feed-item" class:critical={i===0} class:alert={i>0 && i<3}>
					<div class="fi-dot" class:dot-r={i===0} class:dot-w={i<3 && i>0} class:dot-b={i>=3}></div>
					<div class="fi-body">
						<p class="fi-title">{art.title}</p>
						<span class="fi-src mono">{art.source}</span>
					</div>
				</a>
			{/each}
		{/if}
	</div>

	<!-- Stability Indices -->
	<div class="indices">
		<div class="idx-header">STABILITY INDEX</div>
		{#each indices as idx}
			<div class="idx-row">
				<span class="idx-name">{idx.label}</span>
				<div class="idx-bar"><div class="idx-fill" class:warn={idx.value<50} style="width:{idx.value}%"></div></div>
				<span class="idx-val mono" class:warn-t={idx.value<50}>{idx.value.toFixed(0)}</span>
				{#if idx.trend >= 0}
					<TrendingUp size={10} class="up-icon" />
				{:else}
					<TrendingDown size={10} class="dn-icon" />
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.ip {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}
	.ip-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 6px 10px;
		background: rgba(255,255,255,0.02);
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
	}
	.ip-title { font-size: 0.6rem; font-weight: 800; letter-spacing: 1px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; }
	.ip-live { font-size: 0.5rem; font-weight: 900; color: var(--accent); }

	.feed {
		flex: 1 1 0;
		min-height: 0;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		padding: 6px;
		gap: 4px;
	}
	.loading { text-align: center; padding: 20px; font-size: 0.6rem; color: var(--text-muted); }

	.feed-item {
		display: flex;
		gap: 8px;
		padding: 6px;
		border-radius: 3px;
		text-decoration: none;
		color: inherit;
		flex-shrink: 0;
		border-left: 2px solid var(--bg-tertiary);
	}
	.feed-item:hover { background: rgba(255,255,255,0.03); }
	.feed-item.critical { border-left-color: var(--danger); background: rgba(239,68,68,0.04); }
	.feed-item.alert { border-left-color: var(--warning); background: rgba(245,158,11,0.04); }

	.fi-dot { width: 5px; height: 5px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; background: var(--text-muted); }
	.dot-r { background: var(--danger); box-shadow: 0 0 4px var(--danger); }
	.dot-w { background: var(--warning); box-shadow: 0 0 4px var(--warning); }
	.dot-b { background: var(--accent); }

	.fi-body { flex: 1; min-width: 0; }
	.fi-title { font-size: 0.62rem; font-weight: 600; line-height: 1.35; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
	.fi-src { font-size: 0.5rem; color: var(--text-muted); }

	.indices {
		flex-shrink: 0;
		padding: 8px 10px;
		border-top: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.idx-header { font-size: 0.5rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; }
	.idx-row { display: flex; align-items: center; gap: 6px; }
	.idx-name { font-size: 0.55rem; font-weight: 700; width: 55px; color: var(--text-secondary); }
	.idx-bar { flex: 1; height: 3px; background: var(--bg-tertiary); border-radius: 2px; overflow: hidden; }
	.idx-fill { height: 100%; background: var(--success); transition: width 0.5s; }
	.idx-fill.warn { background: var(--warning); }
	.idx-val { font-size: 0.6rem; font-weight: 800; width: 22px; text-align: right; }
	.warn-t { color: var(--warning); }
	:global(.up-icon) { color: var(--success); }
	:global(.dn-icon) { color: var(--warning); }
</style>
