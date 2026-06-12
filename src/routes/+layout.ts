// import { LayoutLoad } from "./$types";
import { GetUser } from "$lib/spotify";

export const ssr = false;
export const prerender = true;

export const load /*: LayoutLoad */ = async ({ }) => {
  return { user: await GetUser() }
}
