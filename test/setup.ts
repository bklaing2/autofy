import { vi } from "vitest";

vi.mock(import("$env/static/public"), () => ({
  PUBLIC_SPOTIFY_CLIENT_ID: "mocked spotify client id",
  PUBLIC_REDIRECT_TARGET: "mocked spotify redirect target"
}));

