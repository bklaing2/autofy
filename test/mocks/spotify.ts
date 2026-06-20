const mockUserId = "id";

export const mockUser = {
  id: mockUserId,
  display_name: "Display Name",
  images: [
    { height: 300, width: 300, url: "https://i.scdn.co/image/string" },
    { height: 64, width: 64, url: "https://i.scdn.co/image/string" }
  ],

  type: "user",
  account_id: "account id",
  email: "email@gmail.com",
  uri: `spotify:user:${mockUserId}`,
  href: `https://api.spotify.com/v1/users/${mockUserId}`,
  external_urls: { spotify: `https://open.spotify.com/user/${mockUserId}` },
  followers: { href: null, total: 8 },
} as any;

type BuildCollectionData = Partial<{
  id: string
  name: string
  description: string
  trackCount: number
}>

export const buildMockCollectionsResponse = (collectionData: BuildCollectionData[]) => ({
  href: `https://api.spotify.com/v1/users/${mockUserId}/playlists`,
  limit: 50,
  next: null,
  offset: 0,
  previous: null,
  total: 126,
  items: collectionData.map(buildCollection)
} as any)

function buildCollection(info: BuildCollectionData, index: number) {
  const {
    id: playlistId = `playlist id ${index}`,
    name = `Playlist ${index} Name`,
    description = `Playlist ${index} Description`,
    trackCount = Math.floor(Math.random() * 100)
  } = info

  return {
    id: playlistId,
    name,
    description,
    images: [{ height: null, width: null, url: "https://i.scdn.co/image/image id" }],
    tracks: {
      href: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      total: trackCount
    },
    public: true,

    type: "playlist",
    uri: `spotify:playlist:${playlistId}`,
    href: `https://api.spotify.com/v1/playlists/${playlistId}`,
    external_urls: { spotify: `https://open.spotify.com/playlist/${playlistId}` },
    owner: {
      display_name: mockUser.display_name,
      external_urls: { spotify: `https://open.spotify.com/user/${mockUserId}` },
      href: `https://api.spotify.com/v1/users/${mockUserId}`,
      id: mockUserId,
      type: "user",
      uri: `spotify:user:${mockUserId}`
    },
    collaborative: false,
    items: {
      href: `https://api.spotify.com/v1/playlists/${playlistId}/items`,
      total: trackCount
    },
    snapshot_id: "snapshot id",
    primary_color: null,
  }
}

type BuildTrackData = {
  id?: string
  name?: string
  artistIds: string[]
}

export const buildMockCollectionTracksResponse = <T>(
  trackData: BuildTrackData[],
  formatItem: (info: BuildTrackData, index: number) => T
) => ({
  href: "https://api.spotify.com/v1/playlists/playlist id/tracks",
  limit: 100,
  next: null,
  offset: 0,
  previous: null,
  total: trackData.length,
  items: trackData.map(formatItem)
})

export const buildMockAlbumTracksResponse = (trackData: BuildTrackData[]) =>
  buildMockCollectionTracksResponse(trackData, buildTrack)

export const buildMockPlaylistTracksResponse = (trackData: BuildTrackData[]) =>
  buildMockCollectionTracksResponse(trackData, buildPlaylistTrack)

function buildTrack(info: BuildTrackData, index: number) {
  const {
    id: trackId = `track id ${index}`,
    name: trackName = `Track ${index} Name`,
    artistIds
  } = info

  const artists = artistIds.map((artistId) => ({
    type: "artist",
    id: artistId,
    name: artistId,
    external_urls: { spotify: `https://open.spotify.com/artist/${artistId}` },
    href: `https://api.spotify.com/v1/artists/${artistId}`,
    uri: `spotify:artist:${artistId}`
  }))

  return {
    id: trackId,
    name: trackName,
    artists,

    preview_url: "https://p.scdn.co/mp3-preview/e5cbcc76333a4a1d51dfd09418e889ecb3cbcba2?cid=354b45cce13644c496da96c03e86a35d",
    available_markets: [], //string[]
    explicit: false,
    type: "track",
    episode: false,
    track: true,
    album: {
      artists,
      available_markets: [], // string[]
      type: "album",
      album_type: "single",
      href: "https://api.spotify.com/v1/albums/7kktQeroV0ungK9xo84TUL",
      id: "7kktQeroV0ungK9xo84TUL",
      images: [{ height: 640, url: "https://i.scdn.co/image/ab67616d0000b273078ab43c3473e42ee4da3637", width: 640 }],
      name: "Finger",
      release_date: "2025-12-12",
      release_date_precision: "day",
      uri: "spotify:album:7kktQeroV0ungK9xo84TUL",
      external_urls: { spotify: "https://open.spotify.com/album/7kktQeroV0ungK9xo84TUL" },
      total_tracks: 1
    },
    disc_number: 1,
    track_number: 1,
    duration_ms: 170834,
    external_ids: { isrc: "QT6652543709" },
    external_urls: { spotify: `https://open.spotify.com/track/${trackId}` },
    href: `https://api.spotify.com/v1/tracks/${trackId}`,
    popularity: 51,
    uri: `spotify:track:${trackId}`,
    is_local: false
  }
}

function buildPlaylistTrack(info: BuildTrackData, index: number) {
  const {
    id: trackId = `track id ${index}`,
    name: trackName = `Track ${index} Name`,
    artistIds
  } = info

  const artists = artistIds.map((artistId) => ({
    type: "artist",
    id: artistId,
    name: artistId,
    external_urls: { spotify: `https://open.spotify.com/artist/${artistId}` },
    href: `https://api.spotify.com/v1/artists/${artistId}`,
    uri: `spotify:artist:${artistId}`
  }))

  return {
    track: buildTrack(info, index),
    added_at: "2026-06-18T02:24:25Z",
    added_by: {
      id: mockUserId,
      type: "user",
      external_urls: { spotify: `https://open.spotify.com/user/${mockUserId}` },
      href: `https://api.spotify.com/v1/users/${mockUserId}`,
      uri: `spotify:user:${mockUserId}`
    },
    is_local: false,
    primary_color: null,
    item: {
      preview_url: "https://p.scdn.co/mp3-preview/e5cbcc76333a4a1d51dfd09418e889ecb3cbcba2?cid=354b45cce13644c496da96c03e86a35d",
      available_markets: [], // string[]
      explicit: false,
      type: "track",
      episode: false,
      track: true,
      album: {
        available_markets: [], // string[]
        type: "album",
        album_type: "single",
        href: "https://api.spotify.com/v1/albums/7kktQeroV0ungK9xo84TUL",
        id: "7kktQeroV0ungK9xo84TUL",
        images: [{ height: 640, url: "https://i.scdn.co/image/ab67616d0000b273078ab43c3473e42ee4da3637", width: 640 }],
        name: "Finger",
        release_date: "2025-12-12",
        release_date_precision: "day",
        uri: "spotify:album:7kktQeroV0ungK9xo84TUL",
        artists,
        external_urls: { spotify: "https://open.spotify.com/album/7kktQeroV0ungK9xo84TUL" },
        total_tracks: 1
      },
      artists,
      disc_number: 1,
      track_number: 1,
      duration_ms: 170834,
      external_ids: { isrc: "QT6652543709" },
      external_urls: { spotify: `https://open.spotify.com/track/${trackId}` },
      href: `https://api.spotify.com/v1/tracks/${trackId}`,
      id: trackId,
      name: trackName,
      popularity: 51,
      uri: `spotify:track:${trackId}`,
      is_local: false
    },
    video_thumbnail: { url: null }
  }
}
