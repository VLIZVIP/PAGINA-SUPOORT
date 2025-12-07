import { DISCORD_CONFIG } from "./discord-config"

export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string
}

export function getDiscordAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: DISCORD_CONFIG.CLIENT_ID,
    redirect_uri: DISCORD_CONFIG.REDIRECT_URI,
    response_type: "code",
    scope: DISCORD_CONFIG.SCOPES,
  })

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: DISCORD_CONFIG.CLIENT_ID,
      client_secret: DISCORD_CONFIG.CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: DISCORD_CONFIG.REDIRECT_URI,
    }),
  })

  const data = await response.json()
  return data.access_token
}

export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.json()
}
