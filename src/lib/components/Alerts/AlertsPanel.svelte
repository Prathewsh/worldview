<script>
	import { onMount } from 'svelte';
	import { Cpu, Zap, Shield } from 'lucide-svelte';

	let alerts = $state([]);
	let isLoading = $state(true);

	// Real-time alerts from GDELT GEO API
	async function fetchAlerts() {
		try {
			const res = await fetch('/api/gdelt?query=military OR sanctions OR strike OR attack&max=8');
			const data = await res.json();
			if (data?.articles) {
				alerts = data.articles.map((a, i) => ({
					title: a.title,
					source: a.domain || 'SIGINT',
					level: i < 2 ? 'CRIT' : (i < 4 ? 'HIGH' : 'MED'),
					url: a.url
				}));
			}
		} catch(e) { console.error('Alerts fetch error:', e); }
		isLoading = false;
	}

	let sysStats = $state([
		{ label: 'CPU LOAD', value: '34%', ok: true },
		{ label: 'NODES', value: '1,402', ok: true },
		{ label: 'TEMP', value: '41°C', ok: true },
		{ label: 'NET I/O', value: '2.4 Gbps', ok: true },
	]);

	onMount(() => {
		fetchAlerts();
		const i = setInterval(fetchAlerts, 180000);
		return () => clearInterval(i);
	});
</script>

<div class="ap">
	<div class="ap-header">
		<span class="ap-title"><Cpu size={12} /> STRATEGIC ALERTS</span>
	</div>

	<!-- System Stats Bar -->
	<div class="sys-bar">
		{#each sysStats as s}
			<div class="sys-item">
				<span class="sys-label">{s.label}</span>
				<span class="sys-val mono">{s.value}</span>
			</div>
		{/each}
	</div>

	<!-- Alerts Feed -->
	<div class="alert-feed">
		{#if isLoading}
			<div class="a-loading mono">SYNCHRONIZING...</div>
		{:else}
			{#each alerts as alert}
				<a href={alert.url} target="_blank" class="alert-item"
					class:crit={alert.level === 'CRIT'}
					class:high={alert.level === 'HIGH'}>
					<div class="a-badge" class:bg-r={alert.level === 'CRIT'} class:bg-w={alert.level === 'HIGH'}>{alert.level}</div>
					<div class="a-body">
						<p class="a-title">{alert.title}</p>
						<span class="a-src mono">{alert.source}</span>
					</div>
				</a>
			{/each}
		{/if}
	</div>
</div>

<style>
	.ap {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}
	.ap-header {
		display: flex;
		align-items: center;
		padding: 6px 10px;
		background: rgba(255,255,255,0.02);
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
	}
	.ap-title { font-size: 0.6rem; font-weight: 800; letter-spacing: 1px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; }

	.sys-bar {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 4px;
		padding: 8px;
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
	}
	.sys-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: rgba(255,255,255,0.02);
		padding: 4px 6px;
		border-radius: 3px;
	}
	.sys-label { font-size: 0.45rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.5px; }
	.sys-val { font-size: 0.55rem; font-weight: 700; color: var(--success); }

	.alert-feed {
		flex: 1 1 0;
		min-height: 0;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 3px;
		padding: 6px;
	}
	.a-loading { text-align: center; padding: 20px; font-size: 0.55rem; color: var(--text-muted); }

	.alert-item {
		display: flex;
		gap: 8px;
		padding: 6px;
		border-radius: 3px;
		text-decoration: none;
		color: inherit;
		flex-shrink: 0;
		border-left: 2px solid var(--bg-tertiary);
		align-items: flex-start;
	}
	.alert-item:hover { background: rgba(255,255,255,0.03); }
	.alert-item.crit { border-left-color: var(--danger); }
	.alert-item.high { border-left-color: var(--warning); }

	.a-badge {
		font-size: 0.4rem; font-weight: 900;
		padding: 1px 4px; border-radius: 2px;
		background: var(--bg-tertiary); color: var(--text-secondary);
		flex-shrink: 0; margin-top: 2px;
	}
	.bg-r { background: var(--danger); color: white; }
	.bg-w { background: var(--warning); color: black; }

	.a-body { flex: 1; min-width: 0; }
	.a-title { font-size: 0.6rem; font-weight: 600; line-height: 1.35; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
	.a-src { font-size: 0.45rem; color: var(--text-muted); }
</style>
