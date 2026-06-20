<script lang="ts">
	import { RefreshPlaylist } from '$lib/spotify';
	import type { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';
	let { data } = $props();

	function triggerPlaylistRefresh(playlist: SimplifiedPlaylist) {
		RefreshPlaylist(playlist);
	}
</script>

<main class="flex flex-wrap justify-center gap-x-8 gap-y-12">
	<h1 class="w-full text-[2rem] text-center">my autofy playlists</h1>

	{#each data.playlists as playlist}
		<div
			class="group w-75 max-w-full max-h-full aspect-[1/1.414] bg-linear-to-tr from-[#ab8df8] to-[#ff00d0] rounded-xl relative"
		>
			<iframe
				title="playlist"
				src={`https://open.spotify.com/embed/playlist/${playlist.id}`}
				height="100%"
				frameBorder="0"
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
				loading="lazy"
			></iframe>

			<button
				onclick={() => triggerPlaylistRefresh(playlist)}
				class="invisible group-hover:visible absolute bottom-3 right-3 w-10 h-10 text-2xl text-white bg-[#ab8df850] rounded-full flex justify-center items-center backdrop-blur-xs text-shadow-[-0.1px_-0.1px_0px_white,-0.1px_-0.1px_1px_black] shadow-[inset_1px_1px_3px_0px_white,inset_-2px_-2px_3px_0px_black]"
				data-sveltekit-noscroll>⟳</button
			>
		</div>
	{/each}

	<!-- <a class="playlist wireframe" href={resolve("/create-playlist")}>+</a> -->
</main>
