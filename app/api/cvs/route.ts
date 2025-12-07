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
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(cvs)
  } catch (error) {
    console.error("[CVs] Error fetching CVs:", error)
    return NextResponse.json({ error: "Failed to fetch CVs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const cv = await prisma.cV.create({
      data: {
        userId: user.userId,
        title: body.title || "Untitled CV",
        personalInfo: body.personalInfo || {},
        educations: body.educations || [],
        experiences: body.experiences || [],
        skills: body.skills || [],
        projects: body.projects || [],
      },
    })

    return NextResponse.json(cv, { status: 201 })
  } catch (error) {
    console.error("[CVs] Error creating CV:", error)
    return NextResponse.json({ error: "Failed to create CV" }, { status: 500 })
  }
}
