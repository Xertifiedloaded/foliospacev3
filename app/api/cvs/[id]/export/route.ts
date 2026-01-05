import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-middleware"
import { jsPDF } from "jspdf"
import { getTemplateStyle, FREE_TEMPLATES } from "@/lib/pdf-templates"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)

    let templateId = searchParams.get("template")

    const cv = await prisma.cV.findUnique({
      where: { id },
    })

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    if (cv.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const personalInfo = cv.personalInfo as Record<string, unknown>
    if (!templateId && personalInfo.selectedTemplate) {
      templateId = personalInfo.selectedTemplate as string
    }
    if (!templateId) {
      templateId = "professional-blue"
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

    const isPremiumTemplate = !FREE_TEMPLATES.includes(templateId)

    if (isPremiumTemplate && userDetails.subscriptionTier !== "PREMIUM") {
      return NextResponse.json(
        {
          error: "Premium Required",
          message: "This template is only available for Premium users. Upgrade to unlock!",
          upgradeRequired: true,
        },
        { status: 403 },
      )
    }
    const userCVs = await prisma.cV.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    })

    const cvIndex = userCVs.findIndex((c) => c.id === cv.id)

    if (userDetails.subscriptionTier === "FREE") {
      if (cvIndex >= userDetails.templatesLimit) {
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
    }

    const style = getTemplateStyle(templateId)

    const doc = new jsPDF({
      format: "a4",
      unit: "mm",
    })

    const educations = (cv.educations as unknown[]) || []
    const experiences = (cv.experiences as unknown[]) || []
    const skills = (cv.skills as unknown[]) || []
    const projects = (cv.projects as unknown[]) || []
    const certificates = (cv.certificates as unknown[]) || []
    const awards = (cv.awards as unknown[]) || []

    const sortedExperiences = [...experiences].sort((a: any, b: any) => {
      const aActive = !a.endDate
      const bActive = !b.endDate
      if (aActive && !bActive) return -1
      if (!aActive && bActive) return 1
      if (!aActive && !bActive) {
        const aDate = new Date(a.endDate).getTime()
        const bDate = new Date(b.endDate).getTime()
        return bDate - aDate
      }
      return 0
    })

    const sortedEducations = [...educations].sort((a: any, b: any) => {
      const aOngoing = !a.endDate
      const bOngoing = !b.endDate
      if (aOngoing && !bOngoing) return -1
      if (!aOngoing && bOngoing) return 1
      if (!aOngoing && !bOngoing) {
        const aDate = new Date(a.endDate).getTime()
        const bDate = new Date(b.endDate).getTime()
        return bDate - aDate
      }
      return 0
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const horizontalMargin = 25.4
    const verticalMargin = 15.24
    const contentWidth = pageWidth - 2 * horizontalMargin
    let yPosition = verticalMargin

    const checkPageBreak = (neededSpace = 15) => {
      if (yPosition + neededSpace > pageHeight - verticalMargin) {
        doc.addPage()
        yPosition = verticalMargin
        return true
      }
      return false
    }

    const addSection = (title: string) => {
      checkPageBreak(15)
      yPosition += 6
      doc.setFillColor(style.primaryColor)
      doc.rect(horizontalMargin - 2, yPosition - 4, contentWidth + 4, 7, "F")
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor("#FFFFFF")
      doc.text(title.toUpperCase(), horizontalMargin, yPosition)
      yPosition += 8
    }

    if (personalInfo.fullName) {
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(style.primaryColor)
      doc.text((personalInfo.fullName as string).toUpperCase(), horizontalMargin, yPosition)
      yPosition += 8

      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(style.secondaryColor)

      const leftColumn: string[] = []
      const rightColumn: string[] = []

      if (personalInfo.email) leftColumn.push(`Email: ${personalInfo.email}`)
      if (personalInfo.phone) leftColumn.push(`Phone: ${personalInfo.phone}`)
      if (personalInfo.location) leftColumn.push(`Location: ${personalInfo.location}`)
      if (personalInfo.linkedin) rightColumn.push(`LinkedIn: ${personalInfo.linkedin}`)
      if (personalInfo.github) rightColumn.push(`GitHub: ${personalInfo.github}`)
      if (personalInfo.website) rightColumn.push(`Website: ${personalInfo.website}`)

      const maxRows = Math.max(leftColumn.length, rightColumn.length)

      for (let i = 0; i < maxRows; i++) {
        if (leftColumn[i]) {
          doc.text(leftColumn[i], horizontalMargin, yPosition)
        }
        if (rightColumn[i]) {
          doc.text(rightColumn[i], pageWidth / 2 + 5, yPosition)
        }
        yPosition += 4.5
      }

      yPosition += 2
      doc.setDrawColor(style.accentColor)
      doc.setLineWidth(0.5)
      doc.line(horizontalMargin, yPosition, pageWidth - horizontalMargin, yPosition)
      yPosition += 3
    }

    if (personalInfo.summary) {
      addSection("Professional Summary")
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(style.textColor)
      const summaryLines = doc.splitTextToSize(personalInfo.summary as string, contentWidth)
      summaryLines.forEach((line: string) => {
        checkPageBreak()
        doc.text(line, horizontalMargin, yPosition)
        yPosition += 5
      })
      yPosition += 2
    }

    if (skills.length > 0) {
      addSection("Skills")
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(style.textColor)

      const padding = 2.5 
      const skillHeight = 5.5 
      const gapBetweenSkills = 2.5 
      const lineSpacing = 1.5 
      const borderRadius = 1.5 
      
      let currentX = horizontalMargin
      let currentRowMaxY = yPosition
      let isFirstSkillInRow = true

      skills.forEach((skill: any, index: number) => {
        const skillText = skill.name || skill
        const textWidth = doc.getTextWidth(skillText)
        const boxWidth = textWidth + (padding * 2)

        if (!isFirstSkillInRow && currentX + boxWidth > pageWidth - horizontalMargin) {
          yPosition = currentRowMaxY + skillHeight + lineSpacing
          currentX = horizontalMargin
          currentRowMaxY = yPosition
          isFirstSkillInRow = true
          checkPageBreak(10)
        }
        doc.setDrawColor(100, 100, 100) 
        doc.setLineWidth(0.2)
      
        const x = currentX
        const y = yPosition - 4
        const w = boxWidth
        const h = skillHeight
        const r = borderRadius
        
        doc.roundedRect(x, y, w, h, r, r, 'S')
        
        doc.setTextColor(style.textColor)
        doc.setFont("helvetica", "normal")
        doc.text(skillText, currentX + padding, yPosition)
        currentX += boxWidth + gapBetweenSkills
        isFirstSkillInRow = false
      })

      yPosition = currentRowMaxY + skillHeight + 4
    }

    if (sortedExperiences.length > 0) {
      addSection("Professional Experience")
      sortedExperiences.forEach((exp: any, idx: number) => {
        if (idx > 0) yPosition += 5
        checkPageBreak(20)

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(style.primaryColor)
        doc.text(exp.position, horizontalMargin, yPosition)

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(style.secondaryColor)
        const startYear = exp.startDate ? exp.startDate.split("-")[0] : ""
        const endYear = exp.endDate ? exp.endDate.split("-")[0] : "Present"
        const dateText = startYear && endYear ? `${startYear} - ${endYear}` : startYear || endYear
        const dateWidth = doc.getTextWidth(dateText)
        doc.text(dateText, pageWidth - horizontalMargin - dateWidth, yPosition)

        yPosition += 5

        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(style.secondaryColor)
        doc.text(exp.company, horizontalMargin, yPosition)
        yPosition += 5

        if (exp.description) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(style.textColor)

          const descriptions = exp.description
            .split(".")
            .map((d: string) => d.trim())
            .filter((d: string) => d.length > 0)

          descriptions.forEach((desc: string) => {
            const bullet = "• "
            const descLines = doc.splitTextToSize(desc, contentWidth - 5)
            descLines.forEach((line: string, lineIdx: number) => {
              checkPageBreak()
              if (lineIdx === 0) {
                doc.text(bullet + line, horizontalMargin + 2, yPosition)
              } else {
                doc.text(line, horizontalMargin + 7, yPosition)
              }
              yPosition += 4.5
            })
          })
        }
        yPosition += 1
      })
      yPosition += 2
    }

    if (sortedEducations.length > 0) {
      addSection("Education")
      sortedEducations.forEach((edu: any, idx: number) => {
        if (idx > 0) yPosition += 5
        checkPageBreak(20)

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(style.primaryColor)
        doc.text(edu.degree, horizontalMargin, yPosition)

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(style.secondaryColor)
        const startYear = edu.startDate ? edu.startDate.split("-")[0] : ""
        const endYear = edu.endDate ? edu.endDate.split("-")[0] : "In View"
        const dateText = startYear && endYear ? `${startYear} - ${endYear}` : startYear || endYear
        const dateWidth = doc.getTextWidth(dateText)
        doc.text(dateText, pageWidth - horizontalMargin - dateWidth, yPosition)

        yPosition += 5

        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(style.secondaryColor)
        doc.text(edu.school, horizontalMargin, yPosition)
        yPosition += 5

        if (edu.field) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(style.textColor)
          doc.text(`Field of Study: ${edu.field}`, horizontalMargin + 2, yPosition)
          yPosition += 5
        }
      })
      yPosition += 2
    }

    if (cv.showProjects && projects.length > 0) {
      addSection("Projects")
      projects.forEach((project: any, idx: number) => {
        if (idx > 0) yPosition += 5
        checkPageBreak(20)

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(style.primaryColor)
        doc.text(project.name || project.title, horizontalMargin, yPosition)

        if (project.startDate || project.endDate) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(style.secondaryColor)
          const startYear = project.startDate ? project.startDate.split("-")[0] : ""
          const endYear = project.endDate ? project.endDate.split("-")[0] : "Present"
          const dateText = startYear && endYear ? `${startYear} - ${endYear}` : startYear || endYear
          const dateWidth = doc.getTextWidth(dateText)
          doc.text(dateText, pageWidth - horizontalMargin - dateWidth, yPosition)
        }

        yPosition += 5

        if (project.technologies) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "italic")
          doc.setTextColor(style.secondaryColor)
          doc.text(`Technologies: ${project.technologies}`, horizontalMargin + 2, yPosition)
          yPosition += 5
        }

        if (project.description) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(style.textColor)
          const descLines = doc.splitTextToSize(project.description, contentWidth - 5)
          descLines.forEach((line: string) => {
            checkPageBreak()
            doc.text(line, horizontalMargin + 2, yPosition)
            yPosition += 4.5
          })
        }

        if (project.link || project.url) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(style.primaryColor)
          doc.text(`Link: ${project.link || project.url}`, horizontalMargin + 2, yPosition)
          yPosition += 5
        }
      })
      yPosition += 2
    }

    if (cv.showCertificates && certificates.length > 0) {
      addSection("Certifications")
      certificates.forEach((cert: any, idx: number) => {
        if (idx > 0) yPosition += 5
        checkPageBreak(20)

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(style.primaryColor)
        doc.text(cert.name || cert.title, horizontalMargin, yPosition)

        if (cert.issueDate || cert.date) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(style.secondaryColor)
          const issueYear = (cert.issueDate || cert.date).split("-")[0]
          const dateWidth = doc.getTextWidth(issueYear)
          doc.text(issueYear, pageWidth - horizontalMargin - dateWidth, yPosition)
        }

        yPosition += 5

        if (cert.issuer || cert.organization) {
          doc.setFontSize(10)
          doc.setFont("helvetica", "bold")
          doc.setTextColor(style.secondaryColor)
          doc.text(cert.issuer || cert.organization, horizontalMargin + 2, yPosition)
          yPosition += 5
        }

        if (cert.credentialId) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(style.textColor)
          doc.text(`Credential ID: ${cert.credentialId}`, horizontalMargin + 2, yPosition)
          yPosition += 5
        }

        if (cert.url || cert.link) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(style.primaryColor)
          doc.text(`Verify: ${cert.url || cert.link}`, horizontalMargin + 2, yPosition)
          yPosition += 5
        }
      })
      yPosition += 2
    }

    if (cv.showAwards && awards.length > 0) {
      addSection("Awards & Honors")
      awards.forEach((award: any, idx: number) => {
        if (idx > 0) yPosition += 5
        checkPageBreak(20)

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(style.primaryColor)
        doc.text(award.name || award.title, horizontalMargin, yPosition)

        if (award.date || award.year) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(style.secondaryColor)
          const awardYear = award.year || (award.date ? award.date.split("-")[0] : "")
          const dateWidth = doc.getTextWidth(awardYear)
          doc.text(awardYear, pageWidth - horizontalMargin - dateWidth, yPosition)
        }

        yPosition += 5

        if (award.issuer || award.organization) {
          doc.setFontSize(10)
          doc.setFont("helvetica", "bold")
          doc.setTextColor(style.secondaryColor)
          doc.text(award.issuer || award.organization, horizontalMargin + 2, yPosition)
          yPosition += 5
        }

        if (award.description) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(style.textColor)
          const descLines = doc.splitTextToSize(award.description, contentWidth - 5)
          descLines.forEach((line: string) => {
            checkPageBreak()
            doc.text(line, horizontalMargin + 2, yPosition)
            yPosition += 4.5
          })
        }
      })
      yPosition += 2
    }

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"))
    const title = cv.title || "CV"
    const fullName = (personalInfo.fullName as string) || "Professional"
    const filename = `${fullName}_${title}_Resume.pdf`

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("[CV Export] PDF error:", error)
    return NextResponse.json({ error: "Failed to export PDF" }, { status: 500 })
  }
}