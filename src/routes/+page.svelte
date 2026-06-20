<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();

	const BUTTON_CLASS =
		'w-min mx-auto py-[0.4em] px-[2em] text-accent-1 bg-black border-accent-1 border rounded-[10rem] text-center text-lg block transition-colors duration-100 ease-in hover:text-black hover:bg-accent-1';
</script>

<svelte:head>
	<title>autofy</title>
	<meta name="description" content="Playlist creator utility for Spotify" />
</svelte:head>

<section class="max-w-140 mx-auto px-8">
	<span class="w-full mb-12 text-center text-[1.2rem] text-secondary block">
		No more manual updates!
	</span>

	<p class="mt-0 mb-16 text-justify">
		Playlists created with <span class="autofy">autofy</span> automatically refresh as artists
		release new music.<br /><br />
		<span class="autofy">autofy</span> playlists can also stay up-to-date with your favorite artists,
		adding or removing tracks whenever you follow or unfollow an artist
	</p>

	{#if data.spotify.user}
		<a href={resolve('/playlists')} class={BUTTON_CLASS}> my&nbsp;playlists </a>
	{:else}
		<button onclick={data.SignIn} class={BUTTON_CLASS}>
			connect&nbsp;your&nbsp;Spotify&nbsp;account to&nbsp;get&nbsp;started!
		</button>
	{/if}
</section>
