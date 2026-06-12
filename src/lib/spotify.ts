import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_REDIRECT_TARGET } from "$env/static/public";

const SCOPES = [
  'user-follow-read',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
  'ugc-image-upload'
]

const spotify = SpotifyApi.withUserAuthorization(PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_REDIRECT_TARGET, SCOPES)

export async function GetUser() {
  const user = await spotify.currentUser.profile()
  return {
    name: user.display_name,
    image: user.images[0]?.url
  }
}
export default spotify
