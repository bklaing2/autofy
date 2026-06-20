import type { LayoutLoad } from "./$types";
import { SignIn as SpotifySignIn, SignOut as SpotifySignOut } from "$lib/spotify";
import { spotify } from "$lib/state.svelte";
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";

export const ssr = false;
export const prerender = true;

export const load: LayoutLoad = async ({ url }) => {
  if (!!url.searchParams.get("code")) SignIn()
  return { spotify, SignIn, SignOut }
}

async function SignIn() {
  spotify.user = await SpotifySignIn()
  goto(resolve("/playlists"))
}

async function SignOut() {
  await SpotifySignOut()
  spotify.user = null
  goto(resolve("/"))
}
