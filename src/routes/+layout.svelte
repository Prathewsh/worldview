<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/globals.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>WorldView | Global OSINT Intelligence Dashboard</title>
</svelte:head>

{@render children()}
