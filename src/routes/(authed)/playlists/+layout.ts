import { GetAutofyPlaylists } from "$lib/spotify"
import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async () => {
  return { playlists: await GetAutofyPlaylists() }
}
