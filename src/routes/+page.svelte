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
	<span class="w-full mb-10 text-justify text-xl text-secondary block">
		Add all of an artist's songs to a Spotify playlist
	</span>

	<ol class="list-decimal text-justify flex flex-col gap-2">
		<li>Create a playlist on Spotify</li>
		<li>Include the word "autofy" in the playlist description</li>
		<li>
			Add a song to the playlist, ensuring it has only one artist. Repeat for any artist you want
			included in this playlist
		</li>
		<li>The Spotify playlist should now be visible on <span class="autofy">autofy</span></li>
		<li>
			When you click the refresh button on the bottom right of the playlist <span class="autofy"
				>autofy</span
			> will populate the artist(s) discography!
		</li>
		<li>
			On each subsequent refresh, any songs released since the previous refresh will be added to the
			playlist
		</li>
		<li>
			If you want to add another artist to the playlist simply add a song by that artist to the
			playlist and click the refresh button again!
		</li>
	</ol>

	<p class="mt-10 mb-16 text-justify text-secondary">
		There is no limit to the number of playlists you can enhance with
		<span class="autofy">autofy</span>, so create as many as you like!
	</p>

	{#if data.spotify.user}
		<a href={resolve('/playlists')} class={BUTTON_CLASS}> my&nbsp;playlists </a>
	{:else}
		<button onclick={data.SignIn} class={BUTTON_CLASS}>
			connect&nbsp;your&nbsp;Spotify&nbsp;account to&nbsp;get&nbsp;started!
		</button>
	{/if}
</section>
