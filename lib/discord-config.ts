// IMPORTANT: Automatically detects localhost vs production
export const DISCORD_CONFIG = {
  CLIENT_ID: "1432818764885393552",
  CLIENT_SECRET: "45vAg48zdhY7pO6xWcbIux74ejDbLyPT",
  REDIRECT_URI:
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000/api/auth/discord/callback"
      : "https://vlizvipsupport.netlify.app/api/auth/discord/callback",
  SCOPES: "identify",
}
