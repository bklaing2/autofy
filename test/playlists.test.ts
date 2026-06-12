import { expect, test } from "vitest"
import * as playlistActions from "../src/playlist"

test("filter out user playlists", () => {
  const playlists = [
    { id: "1", name: "autofy playlist", description: "managed by autofy" },
    { id: "3", name: "user playlist", description: "managed by not autofy" },
    { id: "2", name: "autofy playlist with user-updated description", description: "user-added text; managed by autofy; more user text" },
    { id: "4", name: "user playlist (no description)", description: "" },
  ]

  const updatedPlaylists = playlistActions.filterAutofyPlaylists(playlists);
  expect(updatedPlaylists.map(p => p.id)).toEqual(["1", "2"]);
})
