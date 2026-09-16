import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_REFRESH_TOKEN,
} from "$lib/env"
import { google } from "googleapis"

export async function getOAuthClient() {
  const client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  )

  // ✅ refresh_token만 있으면 자동으로 access_token 갱신 관리
  if (GOOGLE_REFRESH_TOKEN) {
    client.setCredentials({
      refresh_token: GOOGLE_REFRESH_TOKEN,
    })
  }

  return client
}
