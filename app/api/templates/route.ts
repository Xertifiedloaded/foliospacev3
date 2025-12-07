import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-middleware"
import { templateStyles, FREE_TEMPLATES } from "@/lib/pdf-templates"

export async function GET() {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const templates = Object.entries(templateStyles).map(([id, style]) => ({
      id,
      name: formatTemplateName(id),
      description: getTemplateDescription(id),
      style,
      tier: FREE_TEMPLATES.includes(id) ? "FREE" : "PREMIUM",
      category: getTemplateCategory(id),
      previewUrl: `/templates/previews/${id}.png`,
    }))

    return NextResponse.json({ templates }, { status: 200 })
  } catch (error) {
    console.error("[Templates] Error fetching templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

function formatTemplateName(id: string): string {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getTemplateDescription(id: string): string {
  const descriptions: Record<string, string> = {
    "professional-blue": "Classic and professional design perfect for corporate roles",
    "modern-minimal": "Clean and minimal design with focus on content",
    "creative-bold": "Eye-catching design for creative professionals",
    "executive-elite": "Premium design for senior leadership positions",
    "tech-innovator": "Modern tech-focused design for IT professionals",
    "creative-gradient": "Vibrant gradient design for creative industries",
    "elegant-classic": "Timeless and elegant design with warm tones",
    "startup-vibes": "Fresh and dynamic design for startup culture",
    "designers-choice": "Bold and artistic design for designers",
    "corporate-pro": "Sophisticated design for corporate professionals",
    "minimalist-dark": "Sleek dark-themed minimal design",
  }
  return descriptions[id] || "Professional CV template"
}

function getTemplateCategory(id: string): string {
  const categories: Record<string, string> = {
    "professional-blue": "professional",
    "modern-minimal": "minimal",
    "creative-bold": "creative",
    "executive-elite": "professional",
    "tech-innovator": "tech",
    "creative-gradient": "creative",
    "elegant-classic": "professional",
    "startup-vibes": "modern",
    "designers-choice": "creative",
    "corporate-pro": "professional",
    "minimalist-dark": "minimal",
  }
  return categories[id] || "professional"
}
