import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-middleware"
import { templateStyles, FREE_TEMPLATES } from "@/lib/pdf-templates"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { templateId } = await request.json()
    if (!templateStyles[templateId]) {
      return NextResponse.json({ error: "Invalid template ID" }, { status: 400 })
    }
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

    const isPremiumTemplate = !FREE_TEMPLATES.includes(templateId)

    if (isPremiumTemplate) {
      const userDetails = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { subscriptionTier: true },
      })

      if (userDetails?.subscriptionTier !== "PREMIUM") {
        return NextResponse.json(
          {
            error: "Premium required",
            message: "This template is only available for Premium users. Upgrade to unlock all templates!",
            upgradeRequired: true,
          },
          { status: 403 },
        )
      }
    }

    const currentPersonalInfo = (cv.personalInfo as Record<string, unknown>) || {}

    await prisma.cV.update({
      where: { id },
      data: {
        personalInfo: {
          ...currentPersonalInfo,
          selectedTemplate: templateId,
        },
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ message: "Template updated successfully", templateId }, { status: 200 })
  } catch (error) {
    console.error("[CV] Template update error:", error)
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
  }
}
