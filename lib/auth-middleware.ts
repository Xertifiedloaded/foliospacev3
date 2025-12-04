import { cookies, headers } from "next/headers"
import { verifyToken, type TokenPayload } from "./jwt"

export async function getAuthUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || "token")?.value

    if (token) {
      const payload = verifyToken(token)
      return payload
    }

    const headersList = await headers()
    const authHeader = headersList.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7)
      const payload = verifyToken(token)
      return payload
    }

    return null
  } catch (error) {
    return null
  }
}
