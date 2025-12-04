import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-middleware"

export async function GET() {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      id: user.userId,
      userId: user.userId,
      email: user.email,
      username: user.username,
      name: user.username, 
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Auth check failed" }, { status: 500 })
  }
}
