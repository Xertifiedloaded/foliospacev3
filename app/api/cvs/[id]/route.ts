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

    return NextResponse.json(cv)
  } catch (error) {
    console.error("[CV] Error fetching CV:", error)
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
    const body = await request.json()

    const cv = await prisma.cV.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    if (cv.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updatedCV = await prisma.cV.update({
      where: { id },
      data: {
        title: body.title,
        personalInfo: body.personalInfo,
        educations: body.educations,
        experiences: body.experiences,
        skills: body.skills,
        projects: body.projects,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedCV)
  } catch (error) {
    console.error("[CV] Error updating CV:", error)
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
      select: { userId: true },
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

    return NextResponse.json({ message: "CV deleted successfully" })
  } catch (error) {
    console.error("[CV] Error deleting CV:", error)
    return NextResponse.json({ error: "Failed to delete CV" }, { status: 500 })
  }
}
