import { resolve } from "$app/paths";
import type { LayoutLoad } from "./$types"
import { redirect } from "@sveltejs/kit";

export const load: LayoutLoad = async ({ parent }) => {
  const { spotify } = await parent()
  if (!spotify.user) redirect(303, resolve("/"));
}
