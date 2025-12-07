import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

import { signToken } from "@/lib/jwt"
import { cookies } from "next/headers"
import { comparePassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        password: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        billingCycle: true,
        subscriptionEndDate: true,
        templatesLimit: true,
        templatesUsed: true,
      },
    })

    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[LOGIN DEBUG] User tier:", user.subscriptionTier)

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
    })

    const response = NextResponse.json({
      userId: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus,
      billingCycle: user.billingCycle,
      subscriptionEndDate: user.subscriptionEndDate,
      templatesLimit: user.templatesLimit,
      templatesUsed: user.templatesUsed,
    })

    const cookieStore = await cookies()
    cookieStore.set(process.env.AUTH_COOKIE_NAME || "token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[LOGIN ERROR]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
