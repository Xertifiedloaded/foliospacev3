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

    const doc = new jsPDF({
      format: "a4",
      unit: "mm",
    })

    const personalInfo = cv.personalInfo as any
    const educations = (cv.educations as any[]) || []
    const experiences = (cv.experiences as any[]) || []
    const skills = (cv.skills as any[]) || []
    const projects = (cv.projects as any[]) || []

    let yPosition = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 15
    const contentWidth = pageWidth - 2 * margin

    // ATS-friendly colors
    const primaryColor = "#2C5282" // Professional blue
    const secondaryColor = "#4A5568" // Dark gray
    const accentColor = "#3182CE" // Lighter blue
    const textColor = "#1A202C" // Near black for best readability

    const addText = (
      text: string, 
      x: number,
      fontSize: number, 
      isBold: boolean = false, 
      color: string = textColor,
      align: "left" | "right" = "left"
    ) => {
      doc.setFontSize(fontSize)
      doc.setFont("helvetica", isBold ? "bold" : "normal")
      doc.setTextColor(color)
      
      const lines = doc.splitTextToSize(text, align === "right" ? contentWidth * 0.3 : contentWidth * 0.65)
      lines.forEach((line: string) => {
        if (yPosition > 280) {
          doc.addPage()
          yPosition = 20
        }
        if (align === "right") {
          const textWidth = doc.getTextWidth(line)
          doc.text(line, pageWidth - margin - textWidth, yPosition)
        } else {
          doc.text(line, x, yPosition)
        }
        yPosition += fontSize * 0.5
      })
    }

    const addSection = (title: string) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
      yPosition += 6
      
      doc.setFillColor(primaryColor)
      doc.rect(margin - 2, yPosition - 4, contentWidth + 4, 7, "F")
      
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor("#FFFFFF")
      doc.text(title.toUpperCase(), margin, yPosition)
      yPosition += 8
    }

    const resetYPosition = () => {
      const startY = yPosition
      return startY
    }


    if (personalInfo.fullName) {
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(primaryColor)
      doc.text(personalInfo.fullName.toUpperCase(), margin, yPosition)
      yPosition += 8

      // Contact information in two columns
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
      const contactStartY = yPosition

      for (let i = 0; i < maxRows; i++) {
        if (leftColumn[i]) {
          doc.text(leftColumn[i], margin, yPosition)
        }
        if (rightColumn[i]) {
          doc.text(rightColumn[i], pageWidth / 2 + 5, yPosition)
        }
        yPosition += 4.5
      }


      yPosition += 2
      doc.setDrawColor(accentColor)
      doc.setLineWidth(0.5)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 3
    }

    // PROFESSIONAL SUMMARY
    if (personalInfo.summary) {
      addSection("Professional Summary")
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(textColor)
      const summaryLines = doc.splitTextToSize(personalInfo.summary, contentWidth)
      summaryLines.forEach((line: string) => {
        if (yPosition > 280) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, margin, yPosition)
        yPosition += 5
      })
      yPosition += 2
    }

    if (experiences.length > 0) {
      addSection("Professional Experience")
      experiences.forEach((exp: any, idx: number) => {
        if (idx > 0) yPosition += 5

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(primaryColor)
        doc.text(exp.position, margin, yPosition)

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(secondaryColor)
        const startYear = exp.startDate ? exp.startDate.split('-')[0] : ''
        const endYear = exp.endDate ? exp.endDate.split('-')[0] : 'Present'
        const dateText = startYear && endYear ? `${startYear} - ${endYear}` : startYear || endYear
        const dateWidth = doc.getTextWidth(dateText)
        doc.text(dateText, pageWidth - margin - dateWidth, yPosition)
        
        yPosition += 5

        // Company name
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(secondaryColor)
        doc.text(exp.company, margin, yPosition)
        yPosition += 5

        // Description with bullet points (split by periods)
        if (exp.description) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(textColor)
          
          // Split by period and filter out empty strings
          const descriptions = exp.description
            .split('.')
            .map((d: string) => d.trim())
            .filter((d: string) => d.length > 0)
          
          descriptions.forEach((desc: string) => {
            const bullet = "• "
            const descLines = doc.splitTextToSize(desc, contentWidth - 5)
            descLines.forEach((line: string, lineIdx: number) => {
              if (yPosition > 280) {
                doc.addPage()
                yPosition = 20
              }
              if (lineIdx === 0) {
                doc.text(bullet + line, margin + 2, yPosition)
              } else {
                doc.text(line, margin + 7, yPosition)
              }
              yPosition += 4.5
            })
          })
        }
        yPosition += 1
      })
      yPosition += 2
    }

    if (educations.length > 0) {
      addSection("Education")
      educations.forEach((edu: any, idx: number) => {
        if (idx > 0) yPosition += 5
        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(primaryColor)
        doc.text(edu.degree, margin, yPosition)

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(secondaryColor)
        const startYear = edu.startDate ? edu.startDate.split('-')[0] : ''
        const endYear = edu.endDate ? edu.endDate.split('-')[0] : 'In View'
        const dateText = startYear && endYear ? `${startYear} - ${endYear}` : startYear || endYear
        const dateWidth = doc.getTextWidth(dateText)
        doc.text(dateText, pageWidth - margin - dateWidth, yPosition)
        
        yPosition += 5

        // School name
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(secondaryColor)
        doc.text(edu.school, margin, yPosition)
        yPosition += 5

        // Field of study
        if (edu.field) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(textColor)
          doc.text(`Field of Study: ${edu.field}`, margin + 2, yPosition)
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
        if (yPosition > 280) {
          doc.addPage()
          yPosition = 20
        }
        
        group.forEach((skill: any, index: number) => {
          const xPos = margin + (index * columnWidth)
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

    if (projects.length > 0) {
      addSection("Projects")
      projects.forEach((proj: any, idx: number) => {
        if (idx > 0) yPosition += 5

        // Project name
        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(primaryColor)
        doc.text(proj.name, margin, yPosition)
        yPosition += 5

        // Description
        if (proj.description) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(textColor)
          const descLines = doc.splitTextToSize(proj.description, contentWidth)
          descLines.forEach((line: string) => {
            if (yPosition > 280) {
              doc.addPage()
              yPosition = 20
            }
            doc.text(line, margin, yPosition)
            yPosition += 4.5
          })
        }

        if (proj.technologies && proj.technologies.length > 0) {
          yPosition += 1
          doc.setFontSize(9)
          doc.setFont("helvetica", "bold")
          doc.setTextColor(secondaryColor)
          doc.text(`Technologies: `, margin, yPosition)
          
          doc.setFont("helvetica", "normal")
          const techText = proj.technologies.join(", ")
          const techLines = doc.splitTextToSize(techText, contentWidth - 30)
          techLines.forEach((line: string, lineIdx: number) => {
            if (yPosition > 280) {
              doc.addPage()
              yPosition = 20
            }
            doc.text(line, margin + (lineIdx === 0 ? 28 : 0), yPosition)
            if (lineIdx < techLines.length - 1) yPosition += 4.5
          })
          yPosition += 5
        }
      })
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