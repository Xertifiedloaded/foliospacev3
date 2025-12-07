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

    const cv = await prisma.cV.findUnique({
      where: { id },
      select: { userId: true, personalInfo: true },
    })

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    if (cv.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const userDetails = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        subscriptionTier: true,
        templatesLimit: true,
      },
    })

    if (!userDetails) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userCVs = await prisma.cV.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    })

    const cvIndex = userCVs.findIndex((c) => c.id === id)
    const isPremium = userDetails.subscriptionTier === "PREMIUM"
    const canDownload = isPremium || cvIndex < userDetails.templatesLimit
    const canChangeTemplate = isPremium 

    return NextResponse.json({
      canDownload,
      canChangeTemplate,
      isPremium,
      cvNumber: cvIndex + 1,
      totalCVs: userCVs.length,
      downloadLimit: userDetails.templatesLimit,
      currentTemplate: (cv.personalInfo as Record<string, unknown>)?.selectedTemplate || "professional-blue",
    })
  } catch (error) {
    console.error("[CV Download Status] Error:", error)
    return NextResponse.json({ error: "Failed to check download status" }, { status: 500 })
  }
}
