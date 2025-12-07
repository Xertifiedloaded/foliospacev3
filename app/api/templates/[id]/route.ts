import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-middleware"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const userDetails = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { subscriptionTier: true },
    })

    if (!userDetails) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const template = await prisma.template.findUnique({
      where: { id },
    })

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    if (template.tier === "PREMIUM" && userDetails.subscriptionTier !== "PREMIUM") {
      return NextResponse.json(
        { error: "Access denied. This template requires a premium subscription." },
        { status: 403 },
      )
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("[v0] Error fetching template:", error)
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 })
  }
}
