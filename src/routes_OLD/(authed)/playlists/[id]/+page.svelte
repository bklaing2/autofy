<script lang="ts">
	import Playlist from '$lib/EditPlaylist/Playlist.svelte';

	let { data } = $props();
	const playlist = data.playlist;
</script>

<svelte:head>
	<title>Playlist Details</title>
	<meta name="description" content="My autofy playlists" />
</svelte:head>

<Playlist {playlist} />
