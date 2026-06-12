import { AUTOFY_DESCRIPTION_INDICATOR } from "./constants"

export function fetchUserPlaylists() {
}

function isAutofyPlaylist(playlist: { description: string }) {
  return playlist.description.toLowerCase().includes(AUTOFY_DESCRIPTION_INDICATOR.toLowerCase())
}

export function filterAutofyPlaylists<T extends { description: string }>(playlists: T[]): T[] {
  return playlists.filter(isAutofyPlaylist)
}
