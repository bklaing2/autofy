import { SpotifyApi, type SimplifiedAlbum, type SimplifiedPlaylist, type SimplifiedTrack } from "@spotify/web-api-ts-sdk";
import { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_REDIRECT_TARGET } from "$env/static/public";

export type User = Awaited<ReturnType<typeof SignIn>>

const AUTOFY_DESCRIPTION_INDICATOR = "autofy" as const

const SCOPES = [
  "user-follow-read",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
  "ugc-image-upload"
]

const api = SpotifyApi.withUserAuthorization(PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_REDIRECT_TARGET, SCOPES)
export default api

export async function SignIn() {
  await api.authenticate()
  const response = await api.currentUser.profile()
  if (response === null) throw new Error("No user found")

  return {
    name: response.display_name,
    image: response.images[0]?.url
  }
}

export async function SignOut() {
  api.logOut()
}

export async function GetAutofyPlaylists() {
  const playlists = await api.currentUser.playlists.playlists()
  if (playlists === null) throw new Error("No playlists found, is the user is signed in?")

  return playlists.items
    .filter(({ description }) => description.toLowerCase().includes(AUTOFY_DESCRIPTION_INDICATOR))
}

export async function RefreshPlaylist(playlist: SimplifiedPlaylist) {
  const playlistTracks = await GetPlaylistTracks(playlist.id)
  const artistIds = await GetUniqueArtistsFromTracks(playlistTracks)
  const artistsTracks = await GetArtistsTracks(artistIds)

  // Filter out tracks that are already in the playlist
  const tracksToAdd = artistsTracks
    .filter(track => !playlistTracks.some(playlistTrack => playlistTrack.id === track.id))

  await AddTracksToPlaylist(playlist, tracksToAdd)
  console.info(`Added ${tracksToAdd.length} tracks to playlist "${playlist.name}"`)
}

// Helpers
async function GetPlaylistTracks(playlistId: string) {
  let tracks: SimplifiedTrack[] = []

  let hasNext = true
  for (let i = 0; hasNext; i++) {
    const response = await api.playlists.getPlaylistItems(playlistId, undefined, undefined, 50, i * 50)
    tracks = tracks.concat(response.items.map(item => item.track))
    hasNext = !!response.next
  }

  return tracks
}

async function GetUniqueArtistsFromTracks(tracks: SimplifiedTrack[]) {
  const artists = new Set<string>()
  for (const { artists: trackArtists } of tracks) {
    // Skip tracks with multiple artists. This is to avoid the scenario where
    // 1. the user adds a track by "Artist A"
    // 2. autofy populates all tracks by "Artist A" into the playlist, where a track is a collaboration between "Artist A" and "Artist B"
    // 3. later, the user updates the playlist in autofy to populate any newly released tracks by "Artist A"
    // 4. autofy sees "Artist B" and mistakenly populates their discography into the playlist
    if (trackArtists.length > 1) continue
    artists.add(trackArtists[0].id)
  }

  return Array.from(artists)
}

async function GetArtistsTracks(artistIds: string[]) {
  let albums: SimplifiedAlbum[] = []
  for (const artistId of artistIds) albums = albums.concat(await GetArtistAlbums(artistId))

  let tracks: SimplifiedTrack[] = []
  for (const album of albums) tracks = tracks.concat(await GetAlbumTracks(album.id))

  return tracks
}

async function GetArtistAlbums(artistId: string) {
  let albums: SimplifiedAlbum[] = []

  let hasNext = true
  for (let i = 0; hasNext; i++) {
    const response = await api.artists.albums(artistId, "album,single", undefined, 50, i * 50)
    albums = albums.concat(response.items)
    hasNext = !!response.next
  }

  return albums
}

async function GetAlbumTracks(albumId: string) {
  let tracks: SimplifiedTrack[] = []

  let hasNext = true
  for (let i = 0; hasNext; i++) {
    const response = await api.albums.tracks(albumId, undefined, 50, i * 50)
    tracks = tracks.concat(response.items)
    hasNext = !!response.next
  }

  return tracks
}


async function AddTracksToPlaylist(playlist: SimplifiedPlaylist, tracks: SimplifiedTrack[]) {
  for (let i = 0; i < tracks.length; i += 100)
    await api.playlists.addItemsToPlaylist(playlist.id, tracks.slice(i, i + 100).map(t => t.uri))
}
