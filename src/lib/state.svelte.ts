import type { User } from "$lib/spotify"

type SpotifyState = { user: User | null }

export let spotify = $state<SpotifyState>({ user: null })

