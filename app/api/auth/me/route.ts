import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        billingCycle: true,
        subscriptionEndDate: true,
        templatesLimit: true,
        templatesUsed: true,
        cvs: {
          select: {
            id: true,
            title: true,
            templateId: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      userId: fullUser.id,
      id: fullUser.id,
      email: fullUser.email,
      username: fullUser.username,
      name: fullUser.name,
      subscriptionTier: fullUser.subscriptionTier,
      subscriptionStatus: fullUser.subscriptionStatus,
      billingCycle: fullUser.billingCycle,
      subscriptionEndDate: fullUser.subscriptionEndDate,
      templatesLimit: fullUser.templatesLimit,
      templatesUsed: fullUser.templatesUsed,
      cvs: fullUser.cvs,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Auth check failed" }, { status: 500 })
  }
}
