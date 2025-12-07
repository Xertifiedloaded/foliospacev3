import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { signToken, type TokenPayload } from "@/lib/jwt"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, username } = await request.json()

    if (!name || !email || !password || !username) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }
      if (existingUser.username === username) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 })
      }
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
        subscriptionTier: "FREE",
        subscriptionStatus: "ACTIVE",
        templatesLimit: 3,
        templatesUsed: 0,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        billingCycle: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        templatesLimit: true,
        templatesUsed: true,
      },
    })

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
    }

    const token = signToken(payload)

    const cookieStore = await cookies()
    cookieStore.set(process.env.AUTH_COOKIE_NAME || "token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    return NextResponse.json(
      {
        userId: user.id,
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus,
        billingCycle: user.billingCycle,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionEndDate: user.subscriptionEndDate,
        templatesLimit: user.templatesLimit,
        templatesUsed: user.templatesUsed,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[Auth] Signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
