<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/image.jpg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Rickify - Spotify Stats</title>
</svelte:head>

<div class="dark min-h-screen bg-zinc-950 text-zinc-50">
	{@render children()}
</div>
