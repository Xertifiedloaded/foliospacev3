import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-middleware"
import { jsPDF } from "jspdf"

const C = {
  navy:  "#1B2A4A",   // name only
  black: "#111111",   // headings, entry titles
  mid:   "#333333",   // body text, bullets, dates
  rule:  "#AAAAAA",   // thin section divider
  white: "#FFFFFF",
} as const

const F  = "helvetica"
const MH = 20   // horizontal margin mm
const MV = 14   // vertical margin mm

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params

    const cv = await prisma.cV.findUnique({ where: { id } })
    if (!cv)                       return NextResponse.json({ error: "CV not found" },  { status: 404 })
    if (cv.userId !== user.userId) return NextResponse.json({ error: "Forbidden" },     { status: 403 })

    const userDetails = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { subscriptionTier: true, templatesLimit: true },
    })
    if (!userDetails) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const userCVs = await prisma.cV.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    })
    const cvIndex = userCVs.findIndex((c) => c.id === cv.id)
    if (userDetails.subscriptionTier === "FREE" && cvIndex >= userDetails.templatesLimit) {
      return NextResponse.json(
        {
          error: "Upgrade to Premium",
          message: `You can only download your first ${userDetails.templatesLimit} CVs on the free plan. Upgrade to Premium to download unlimited CVs.`,
          cvNumber: cvIndex + 1,
          allowedCVs: userDetails.templatesLimit,
          upgradeRequired: true,
        },
        { status: 403 },
      )
    }

    const info         = (cv.personalInfo  as Record<string, unknown>) ?? {}
    const experiences  = ((cv.experiences  as unknown[]) ?? [])
    const educations   = ((cv.educations   as unknown[]) ?? [])
    const skills       = ((cv.skills       as unknown[]) ?? [])
    const projects     = ((cv.projects     as unknown[]) ?? [])
    const certificates = ((cv.certificates as unknown[]) ?? [])
    const awards       = ((cv.awards       as unknown[]) ?? [])

    const byEndDesc = (a: any, b: any) => {
      if (!a.endDate &&  b.endDate) return -1
      if ( a.endDate && !b.endDate) return  1
      if (!a.endDate && !b.endDate) return  0
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    }
    const sortedExp = [...experiences].sort(byEndDesc)
    const sortedEdu = [...educations].sort(byEndDesc)
    const yr = (iso?: string, fb = "Present") => (iso ? iso.split("-")[0] : fb)

    const doc = new jsPDF({ format: "a4", unit: "mm" })
    const PW  = doc.internal.pageSize.getWidth()
    const PH  = doc.internal.pageSize.getHeight()
    const CW  = PW - MH * 2
    let y     = MV

    const guard = (need = 10) => {
      if (y + need > PH - MV) { doc.addPage(); y = MV }
    }


    const thinRule = () => {
      doc.setDrawColor(C.rule)
      doc.setLineWidth(0.3)
      doc.line(MH, y, PW - MH, y)
      y += 5   
    }

    const sectionHeading = (title: string) => {
      guard(16)
      y += 7                         
      doc.setFontSize(9)
      doc.setFont(F, "bold")
      doc.setTextColor(C.black)
      doc.text(title.toUpperCase(), MH, y)
      y += 4                         
      thinRule()                      
    }
    const entryHeader = (title: string, subtitle: string, date: string) => {
      guard(14)
      // title
      doc.setFontSize(10)
      doc.setFont(F, "bold")
      doc.setTextColor(C.black)
      doc.text(title, MH, y)
      // date right-aligned
      if (date) {
        doc.setFontSize(8.5)
        doc.setFont(F, "italic")
        doc.setTextColor(C.mid)
        doc.text(date, PW - MH, y, { align: "right" })
      }
      y += 5
      // subtitle (company / institution)
      if (subtitle) {
        doc.setFontSize(9)
        doc.setFont(F, "normal")
        doc.setTextColor(C.mid)
        doc.text(subtitle, MH, y)
        y += 5
      }
    }

    const bullet = (str: string) => {
      const INDENT = 5
      const lines  = doc.splitTextToSize(str.trim(), CW - INDENT - 2)
      lines.forEach((line: string, i: number) => {
        guard(5)
        doc.setFontSize(9)
        doc.setFont(F, "normal")
        doc.setTextColor(C.mid)
        doc.text((i === 0 ? "\u2013  " : "    ") + line, MH + INDENT, y)
        y += 4.5
      })
    }

    const para = (str: string, indent = 0) => {
      const lines = doc.splitTextToSize(str.trim(), CW - indent)
      lines.forEach((line: string) => {
        guard(5)
        doc.setFontSize(9)
        doc.setFont(F, "normal")
        doc.setTextColor(C.mid)
        doc.text(line, MH + indent, y)
        y += 4.8
      })
    }

    if (info.fullName) {
      doc.setFontSize(22)
      doc.setFont(F, "bold")
      doc.setTextColor(C.navy)
      doc.text((info.fullName as string), MH, y)
      y += 7

      // Optional tagline / job title
      if (info.jobTitle) {
        doc.setFontSize(10)
        doc.setFont(F, "italic")
        doc.setTextColor(C.mid)
        doc.text(info.jobTitle as string, MH, y)
        y += 5
      }
      const contactParts: string[] = []
      if (info.email)    contactParts.push(info.email    as string)
      if (info.phone)    contactParts.push(info.phone    as string)
      if (info.location) contactParts.push(info.location as string)
      if (info.linkedin) contactParts.push(info.linkedin as string)
      if (info.github)   contactParts.push(info.github   as string)
      if (info.website)  contactParts.push(info.website  as string)

      if (contactParts.length) {
        doc.setFontSize(8.5)
        doc.setFont(F, "normal")
        doc.setTextColor(C.mid)
        const fullLine = contactParts.join("   |   ")
        const lineWidth = doc.getTextWidth(fullLine)
        if (lineWidth <= CW) {
          doc.text(fullLine, MH, y)
          y += 4.5
        } else {
          const half = Math.ceil(contactParts.length / 2)
          doc.text(contactParts.slice(0, half).join("   |   "), MH, y)
          y += 4.5
          doc.text(contactParts.slice(half).join("   |   "), MH, y)
          y += 4.5
        }
      }

      y += 1
      doc.setDrawColor(C.navy)
      doc.setLineWidth(0.6)
      doc.line(MH, y, PW - MH, y)
      y += 3
    }

    if (info.summary) {
      sectionHeading("Professional Summary")
      para(info.summary as string)
      y += 2
    }

    if (skills.length > 0) {
      sectionHeading("Technical Skills")
      type S = { name?: string; category?: string } | string
      const groups = new Map<string, string[]>()
      ;(skills as S[]).forEach((s) => {
        const label = typeof s === "string" ? s : (s.name ?? "")
        const cat   = typeof s === "object" && s.category ? s.category : "__flat__"
        if (!groups.has(cat)) groups.set(cat, [])
        groups.get(cat)!.push(label)
      })

      if (groups.size === 1 && groups.has("__flat__")) {
        para(groups.get("__flat__")!.join(", "))
      } else {
        groups.forEach((items, cat) => {
          const label = cat === "__flat__" ? "" : `${cat}:   `
          guard(6)
          doc.setFontSize(9)
          doc.setFont(F, "normal")
          doc.setTextColor(C.mid)

          const line = label + items.join(", ")
          const wrapped = doc.splitTextToSize(line, CW)
          wrapped.forEach((wl: string, i: number) => {
            guard(5)
            // bold the category label on the first line only
            if (i === 0 && cat !== "__flat__") {
              doc.setFont(F, "bold")
              doc.text(`${cat}:`, MH, y)
              const labelW = doc.getTextWidth(`${cat}:   `)
              doc.setFont(F, "normal")
              doc.text(items.join(", "), MH + labelW, y)
            } else {
              doc.setFont(F, "normal")
              doc.text(wl, MH, y)
            }
            y += 4.8
          })
        })
      }
      y += 2
    }


    if (sortedExp.length > 0) {
      sectionHeading("Professional Experience")
      sortedExp.forEach((exp: any, idx: number) => {
        if (idx > 0) y += 3
        entryHeader(
          exp.position ?? "",
          exp.company  ?? "",
          `${yr(exp.startDate, "")} – ${yr(exp.endDate, "Present")}`.trim().replace(/^–\s*/, ""),
        )
        if (exp.description) {
          exp.description
            .split(/(?<=\.)\s+|\n/)
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 1)
            .forEach(bullet)
        }
        y += 1
      })
      y += 2
    }

    if (sortedEdu.length > 0) {
      sectionHeading("Education")
      sortedEdu.forEach((edu: any, idx: number) => {
        if (idx > 0) y += 3
        entryHeader(
          edu.degree ?? "",
          edu.school ?? "",
          `${yr(edu.startDate, "")} – ${yr(edu.endDate, "Present")}`.trim().replace(/^–\s*/, ""),
        )
        if (edu.field) {
          doc.setFontSize(9); doc.setFont(F, "italic"); doc.setTextColor(C.mid)
          doc.text(`Field of Study: ${edu.field}`, MH + 4, y); y += 5
        }
      })
      y += 2
    }

    if (cv.showProjects && projects.length > 0) {
      sectionHeading("Projects")
      projects.forEach((project: any, idx: number) => {
        if (idx > 0) y += 3
        entryHeader(
          project.name  ?? project.title ?? "",
          project.technologies ? `Technologies: ${project.technologies}` : "",
          project.startDate
            ? `${yr(project.startDate)} – ${yr(project.endDate, "Present")}`
            : "",
        )
        if (project.description) para(project.description, 4)
        if (project.link ?? project.url) {
          guard(5)
          doc.setFontSize(8.5); doc.setFont(F, "normal"); doc.setTextColor(C.mid)
          doc.text(`${project.link ?? project.url}`, MH + 4, y); y += 5
        }
      })
      y += 2
    }

    if (cv.showCertificates && certificates.length > 0) {
      sectionHeading("Certifications")
      certificates.forEach((cert: any) => {
        guard(6)
        const rawDate = cert.issueDate ?? cert.date
        const org     = cert.issuer ?? cert.organization ?? ""
        const yr_     = rawDate ? yr(rawDate) : ""
        const line    = [cert.name ?? cert.title ?? "", org, yr_].filter(Boolean).join("  ·  ")
        para(line)
        if (cert.credentialId) {
          doc.setFontSize(8.5); doc.setFont(F, "normal"); doc.setTextColor(C.mid)
          doc.text(`Credential ID: ${cert.credentialId}`, MH + 4, y); y += 4.5
        }
        if (cert.url ?? cert.link) {
          doc.setFontSize(8.5); doc.setFont(F, "normal"); doc.setTextColor(C.mid)
          doc.text(`Verify: ${cert.url ?? cert.link}`, MH + 4, y); y += 4.5
        }
      })
      y += 2
    }

    if (cv.showAwards && awards.length > 0) {
      sectionHeading("Awards & Honours")
      awards.forEach((award: any, idx: number) => {
        if (idx > 0) y += 3
        entryHeader(
          award.name   ?? award.title        ?? "",
          award.issuer ?? award.organization ?? "",
          award.year   ?? (award.date ? yr(award.date) : ""),
        )
        if (award.description) para(award.description, 4)
      })
    }

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"))
    const cvTitle   = cv.title ?? "CV"
    const fullName  = (info.fullName as string) ?? "Professional"
    const filename  = `${fullName}_${cvTitle}_Resume.pdf`

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length":      pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("[CV Export] PDF error:", error)
    return NextResponse.json({ error: "Failed to export PDF" }, { status: 500 })
  }
}