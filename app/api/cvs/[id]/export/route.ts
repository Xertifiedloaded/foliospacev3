import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-middleware"
import { jsPDF } from "jspdf"

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
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    })

    const cvIndex = userCVs.findIndex((c) => c.id === cv.id)
    if (userDetails.subscriptionTier === 'FREE') {
      if (cvIndex >= userDetails.templatesLimit) {
        return NextResponse.json(
          {
            error: "Upgrade to Premium",
            message: `You can only download ${userDetails.templatesLimit} CVs on the free plan. Upgrade to Premium to download unlimited CVs.`,
            cvNumber: cvIndex + 1,
            allowedCVs: userDetails.templatesLimit,
            upgradeRequired: true,
          },
          { status: 403 }
        )
      }
    }

    const doc = new jsPDF({
      format: "a4",
      unit: "mm",
    })

    const personalInfo = cv.personalInfo as any
    const educations = (cv.educations as any[]) || []
    const experiences = (cv.experiences as any[]) || []
    const skills = (cv.skills as any[]) || []

    const sortedExperiences = [...experiences].sort((a, b) => {
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

    const sortedEducations = [...educations].sort((a, b) => {
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

    const primaryColor = "#2C5282"
    const secondaryColor = "#4A5568"
    const accentColor = "#3182CE"
    const textColor = "#1A202C"

    const checkPageBreak = (neededSpace: number = 15) => {
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
      
      doc.setFillColor(primaryColor)
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
      doc.setTextColor(primaryColor)
      doc.text(personalInfo.fullName.toUpperCase(), horizontalMargin, yPosition)
      yPosition += 8

      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(secondaryColor)

      const leftColumn = []
      const rightColumn = []

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
      doc.setDrawColor(accentColor)
      doc.setLineWidth(0.5)
      doc.line(horizontalMargin, yPosition, pageWidth - horizontalMargin, yPosition)
      yPosition += 3
    }

    if (personalInfo.summary) {
      addSection("Professional Summary")
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(textColor)
      const summaryLines = doc.splitTextToSize(personalInfo.summary, contentWidth)
      summaryLines.forEach((line: string) => {
        checkPageBreak()
        doc.text(line, horizontalMargin, yPosition)
        yPosition += 5
      })
      yPosition += 2
    }

    if (sortedExperiences.length > 0) {
      addSection("Professional Experience")
      sortedExperiences.forEach((exp: any, idx: number) => {
        if (idx > 0) yPosition += 5
        checkPageBreak(20)

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(primaryColor)
        doc.text(exp.position, horizontalMargin, yPosition)

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(secondaryColor)
        const startYear = exp.startDate ? exp.startDate.split('-')[0] : ''
        const endYear = exp.endDate ? exp.endDate.split('-')[0] : 'Present'
        const dateText = startYear && endYear ? `${startYear} - ${endYear}` : startYear || endYear
        const dateWidth = doc.getTextWidth(dateText)
        doc.text(dateText, pageWidth - horizontalMargin - dateWidth, yPosition)
        
        yPosition += 5

        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(secondaryColor)
        doc.text(exp.company, horizontalMargin, yPosition)
        yPosition += 5

        if (exp.description) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(textColor)
          
          const descriptions = exp.description
            .split('.')
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
        doc.setTextColor(primaryColor)
        doc.text(edu.degree, horizontalMargin, yPosition)

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(secondaryColor)
        const startYear = edu.startDate ? edu.startDate.split('-')[0] : ''
        const endYear = edu.endDate ? edu.endDate.split('-')[0] : 'In View'
        const dateText = startYear && endYear ? `${startYear} - ${endYear}` : startYear || endYear
        const dateWidth = doc.getTextWidth(dateText)
        doc.text(dateText, pageWidth - horizontalMargin - dateWidth, yPosition)
        
        yPosition += 5

        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(secondaryColor)
        doc.text(edu.school, horizontalMargin, yPosition)
        yPosition += 5

        if (edu.field) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(textColor)
          doc.text(`Field of Study: ${edu.field}`, horizontalMargin + 2, yPosition)
          yPosition += 5
        }
      })
      yPosition += 2
    }

    if (skills.length > 0) {
      addSection("Skills")
      
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(textColor)
      
      const skillsPerRow = 6
      const columnWidth = contentWidth / skillsPerRow
      const skillGroups = []
      
      for (let i = 0; i < skills.length; i += skillsPerRow) {
        skillGroups.push(skills.slice(i, i + skillsPerRow))
      }

      skillGroups.forEach((group: any[]) => {
        checkPageBreak()
        
        group.forEach((skill: any, index: number) => {
          const xPos = horizontalMargin + (index * columnWidth)
          const skillText = skill.name
          
          const maxWidth = columnWidth - 2
          if (doc.getTextWidth(skillText) > maxWidth) {
            const truncated = skill.name.substring(0, 18) + "..."
            doc.text(truncated, xPos, yPosition)
          } else {
            doc.text(skillText, xPos, yPosition)
          }
        })
        
        yPosition += 5
      })
      yPosition += 2
    }

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"))
    const title = cv.title || "CV"
    const fullName = personalInfo.fullName || "Professional"
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
    console.error("PDF export error:", error)
    return NextResponse.json({ error: "Failed to export PDF" }, { status: 500 })
  }
}