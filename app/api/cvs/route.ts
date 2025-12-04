import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-middleware"

export async function GET() {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cvs = await prisma.cV.findMany({
      where: { userId: user.userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(cvs)
  } catch (error) {
    console.error("Get CVs error:", error)
    return NextResponse.json({ error: "Failed to fetch CVs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const cv = await prisma.cV.create({
      data: {
        userId: user.userId,
        title,
        personalInfo: {},
        educations: [],
        experiences: [],
        skills: [],
        projects: [],
      },
    })

    return NextResponse.json(cv, { status: 201 })
  } catch (error) {
    console.error("Create CV error:", error)
    return NextResponse.json({ error: "Failed to create CV" }, { status: 500 })
  }
}
