import { Service as Supabase } from "$lib/server/supabase"
import { Service as Spotify } from "$lib/server/spotify"
import Playlist from "$lib/server/playlist"
import { error } from "@sveltejs/kit"

export async function GET() {
	const supabase = Supabase()

	const response = await supabase
		.from('playlists')
		.select('*, tokens(access_token, refresh_token)')

	if (response.error) return error(500, response.error.message)

	await Promise.all(response.data.map(async playlist => {
		if (!playlist.tokens) return
		const { spotify, accessToken } = await Spotify(playlist.tokens?.access_token, playlist.tokens?.refresh_token)

		await supabase
			.from('tokens')
			.update({ access_token: accessToken })
			.eq('user_id', playlist.user_id)



		// Delete if the user removed the playlist
		const exists = await spotify.getUserPlaylists()
		if (!exists.body.items.find(p => p.id === playlist.id)) {
			await supabase
				.from('playlists')
				.delete()
				.eq('id', playlist.id)
			return
		}

		Playlist.update(playlist, spotify)
	}))

	return new Response(null, { status: 204 })
}
