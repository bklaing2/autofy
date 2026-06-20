import { beforeAll, expect, test, vi } from "vitest"
import api from "../src/lib/spotify"
import * as spotify from "../src/lib/spotify"
import { buildMockPlaylistTracksResponse, buildMockCollectionsResponse, mockUser, buildMockAlbumTracksResponse } from "./mocks/spotify"

beforeAll(() => {
  vi.spyOn(api, "authenticate").mockResolvedValue({
    authenticated: true,
    accessToken: {
      access_token: "mocked access token",
      expires: 1781969027932,
      expires_in: 3600,
      refresh_token: "mocked refresh token",
      token_type: "Bearer"
    }
  })
})

test("SignIn", async () => {
  const spy = vi.spyOn(api.currentUser, "profile")
  spy.mockResolvedValue(mockUser)
  const user = await spotify.SignIn();
  expect(user).toEqual({
    name: mockUser.display_name,
    image: mockUser.images[0].url
  });
})

test("SignIn - throws error when response is null", async () => {
  const spy = vi.spyOn(api.currentUser, "profile")
  spy.mockResolvedValue(null as any)
  const signIn = () => spotify.SignIn();
  await expect(signIn).rejects.toThrow("No user found")
})

test("GetAutofyPlaylists - returns only playlists enhanced by autofy", async () => {
  const spotifyPlaylistsResponse = buildMockCollectionsResponse([
    { name: "autofy playlist", description: "enhanced by autofy" },
    { name: "user playlist", description: "enhanced by notofy" },
    { name: "autofy playlist with user-updated description", description: "user-added text; enhanced by autofy; more user text" },
    { name: "user playlist (no description)", description: "" },
  ])
  const spy = vi.spyOn(api.currentUser.playlists, "playlists")
  spy.mockResolvedValue(spotifyPlaylistsResponse)
  const autofyPlaylists = await spotify.GetAutofyPlaylists();
  expect(autofyPlaylists.length).toEqual(2);
  expect(autofyPlaylists).toEqual([spotifyPlaylistsResponse.items[0], spotifyPlaylistsResponse.items[2]]);
})

test("Refresh autofy playlist", async () => {
  // Set up responses
  const playlistsResponse = buildMockCollectionsResponse([{ description: "autofy" }])

  const playlistTracksResponse = buildMockPlaylistTracksResponse([
    { id: "artist 1 album 1 track 2", artistIds: ["artist 1"] },
    { id: "collaboration (should be ignored)", artistIds: ["artist 3", "artist 4"] },
    { id: "artist 2 album 2 track 1", artistIds: ["artist 2"] },
  ])

  const artist1AlbumsResponse = buildMockCollectionsResponse([{ id: "artist 1 album 1" }])
  const artist2AlbumsResponse = buildMockCollectionsResponse([
    { id: "artist 2 album 1" },
    { id: "artist 2 album 2" }
  ])

  const artist1Album1TracksResponse = buildMockAlbumTracksResponse([
    { id: "artist 1 album 1 track 1", artistIds: ["artist 1"] },
    { id: "artist 1 album 1 track 2", artistIds: ["artist 1"] },
  ])
  const artist2Album1TracksResponse = buildMockAlbumTracksResponse([
    { id: "artist 2 album 1 track 1", artistIds: ["artist 2"] },
    { id: "artist 2 album 1 track 2", artistIds: ["artist 2"] },
  ])
  const artist2Album2TracksResponse = buildMockAlbumTracksResponse([
    { id: "artist 2 album 2 track 1", artistIds: ["artist 2"] },
    { id: "artist 2 album 2 track 2", artistIds: ["artist 2"] },
  ])

  // Set up spies
  vi.spyOn(api.playlists, "getPlaylistItems")
    .mockResolvedValue(playlistTracksResponse as any)

  vi.spyOn(api.artists, "albums")
    .mockImplementation(async (artistId: string) => {
      switch (artistId) {
        case "artist 1": return artist1AlbumsResponse
        case "artist 2": return artist2AlbumsResponse
        default: throw new Error(`Unexpected artist id ${artistId}`)
      }
    })

  vi.spyOn(api.albums, "tracks")
    .mockImplementation(async (albumId: string) => {
      switch (albumId) {
        case "artist 1 album 1": return artist1Album1TracksResponse
        case "artist 2 album 1": return artist2Album1TracksResponse
        case "artist 2 album 2": return artist2Album2TracksResponse
        default: throw new Error(`Unexpected album id ${albumId}`)
      }
    })

  const addItemsToPlaylistSpy = vi.spyOn(api.playlists, "addItemsToPlaylist")
    .mockImplementation(async () => { })

  // Execute
  await spotify.RefreshPlaylist(playlistsResponse.items[0])

  // Expect
  expect(addItemsToPlaylistSpy).toHaveBeenCalledWith(playlistsResponse.items[0].id, [
    "spotify:track:artist 1 album 1 track 1",
    "spotify:track:artist 2 album 1 track 1",
    "spotify:track:artist 2 album 1 track 2",
    "spotify:track:artist 2 album 2 track 2",
  ])
})
