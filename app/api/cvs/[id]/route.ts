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
    })

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    if (cv.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({
      ...cv,
      personalInfo: cv.personalInfo,
      educations: cv.educations,
      experiences: cv.experiences,
      skills: cv.skills,
      projects: cv.projects,
    })
  } catch (error) {
    console.error("Get CV error:", error)
    return NextResponse.json({ error: "Failed to fetch CV" }, { status: 500 })
  }
}
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const cv = await prisma.cV.findUnique({
      where: { id },
    })

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    if (cv.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updateData = await request.json()

    const updatedCV = await prisma.cV.update({
      where: { id },
      data: {
        ...(updateData.title && { title: updateData.title }),
        ...(updateData.personalInfo && { personalInfo: updateData.personalInfo }),
        ...(updateData.educations && { educations: updateData.educations }),
        ...(updateData.experiences && { experiences: updateData.experiences }),
        ...(updateData.skills && { skills: updateData.skills }),
        ...(updateData.projects && { projects: updateData.projects }),
      },
    })

    return NextResponse.json(updatedCV)
  } catch (error) {
    console.error("Update CV error:", error)
    return NextResponse.json({ error: "Failed to update CV" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const cv = await prisma.cV.findUnique({
      where: { id },
    })

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    if (cv.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.cV.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete CV error:", error)
    return NextResponse.json({ error: "Failed to delete CV" }, { status: 500 })
  }
}