<script lang="ts">
	import type { Snippet } from 'svelte';
	import GithubLogo from 'virtual:icons/logos/github-icon';
	import './styles.css';
	import { resolve } from '$app/paths';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>autofy</title>
	<meta name="description" content="Playlist enhancement tool for Spotify" />
</svelte:head>

<div
	class="grid grid-cols-1 grid-rows-[min-content_minmax(min-content,1fr)_min-content] gap-16 h-full max-w-200 m-auto py-8"
>
	<!-- Header -->
	<header
		class="relative grid grid-cols-[repeat(2,max-content)_1fr] justify-items-end items-center gap-8 overflow-scroll pb-8 px-8"
	>
		<a href={resolve('/')}>
			<img src="favicon.png" alt="autofy icon" class="h-8 aspect-square rounded-full" />
		</a>
		<a class="autofy font-black text-[2rem]" href={resolve('/')}>autofy</a>

		{#if data.spotify.user}
			{#if data.spotify.user.image}
				<img
					src={data.spotify.user.image}
					alt={`${data.spotify.user.name} profile picture`}
					class="peer h-8 aspect-square rounded-full"
				/>
			{:else}
				<span class="peer text-secondary">{data.spotify.user.name}</span>
			{/if}

			<button
				onclick={data.SignOut}
				class="invisible peer-hover:visible hover:visible absolute bottom-2 right-6 py-1 px-4 text-[0.8rem] text-white bg-secondary rounded-[10rem] after:content-['▲'] after:absolute after:top-[-0.6rem] after:right-4 after:text-secondary"
				type="submit"
			>
				sign out
			</button>
		{/if}
	</header>

	<!-- Main content -->
	{@render children?.()}

	<!-- Footer -->
	<footer
		class="px-8 py-16 border-t border-white/15 flex flex-row flex-wrap justify-center items-center gap-8"
	>
		<ul class="contents">
			{@render footerLink('/', autofy)}
			{@render footerLink('https://github.com/bklaing2/autofy', gitHub)}
			{@render footerLink('https://buymeacoffee.com/blaing', buyMeACoffee)}

			{#if !!data.spotify.user}
				<li class="contents">
					<button onclick={data.SignOut} class="text-secondary" type="submit">sign out</button>
				</li>
			{/if}
		</ul>
	</footer>
</div>

{#snippet footerLink(href: string, content: Snippet)}
	<li class="contents">
		<a {href} class="font-bold flex items-center gap-2">
			{@render content?.()}
		</a>
	</li>
{/snippet}

{#snippet autofy()}
	<img src="favicon.png" alt="autofy icon" class="w-5" /> autofy
{/snippet}
{#snippet gitHub()}
	<GithubLogo style="fill: gray;" /> GitHub
{/snippet}
{#snippet buyMeACoffee()}
	<a href="https://buymeacoffee.com/blaing" class="font-bold">🍕 support the site!</a>
{/snippet}
