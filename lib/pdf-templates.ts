export type TemplateStyle = {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  backgroundColor: string
  fontFamily: string
}

export const templateStyles: Record<string, TemplateStyle> = {
  "professional-blue": {
    primaryColor: "#2C5282",
    secondaryColor: "#4A5568",
    accentColor: "#3182CE",
    textColor: "#1A202C",
    backgroundColor: "#FFFFFF",
    fontFamily: "helvetica",
  },
  "modern-minimal": {
    primaryColor: "#000000",
    secondaryColor: "#404040",
    accentColor: "#888888",
    textColor: "#1A1A1A",
    backgroundColor: "#FFFFFF",
    fontFamily: "helvetica",
  },
  "creative-bold": {
    primaryColor: "#DC2626",
    secondaryColor: "#991B1B",
    accentColor: "#F87171",
    textColor: "#000000",
    backgroundColor: "#FFFBEB",
    fontFamily: "helvetica",
  },
  "executive-elite": {
    primaryColor: "#1E293B",
    secondaryColor: "#334155",
    accentColor: "#64748B",
    textColor: "#0F172A",
    backgroundColor: "#F8FAFC",
    fontFamily: "helvetica",
  },
  "tech-innovator": {
    primaryColor: "#0369A1",
    secondaryColor: "#0284C7",
    accentColor: "#06B6D4",
    textColor: "#082F49",
    backgroundColor: "#F0F9FF",
    fontFamily: "helvetica",
  },
  "creative-gradient": {
    primaryColor: "#7C3AED",
    secondaryColor: "#A855F7",
    accentColor: "#D946EF",
    textColor: "#2D1B4E",
    backgroundColor: "#F9F5FF",
    fontFamily: "helvetica",
  },
  "elegant-classic": {
    primaryColor: "#78350F",
    secondaryColor: "#92400E",
    accentColor: "#B45309",
    textColor: "#1F2937",
    backgroundColor: "#FFFEF2",
    fontFamily: "helvetica",
  },
  "startup-vibes": {
    primaryColor: "#0891B2",
    secondaryColor: "#06B6D4",
    accentColor: "#00D9FF",
    textColor: "#164E63",
    backgroundColor: "#ECFDFF",
    fontFamily: "helvetica",
  },
  "designers-choice": {
    primaryColor: "#EA580C",
    secondaryColor: "#FB923C",
    accentColor: "#FDBA74",
    textColor: "#431407",
    backgroundColor: "#FFFBF0",
    fontFamily: "helvetica",
  },
  "corporate-pro": {
    primaryColor: "#1F2937",
    secondaryColor: "#374151",
    accentColor: "#6B7280",
    textColor: "#111827",
    backgroundColor: "#F9FAFB",
    fontFamily: "helvetica",
  },
  "minimalist-dark": {
    primaryColor: "#1A1A1A",
    secondaryColor: "#2D2D2D",
    accentColor: "#404040",
    textColor: "#262626",
    backgroundColor: "#FAFAFA",
    fontFamily: "helvetica",
  },
}

export const FREE_TEMPLATES = ["professional-blue", "modern-minimal", "creative-bold"]

export function getTemplateStyle(templateId: string): TemplateStyle {
  return templateStyles[templateId] || templateStyles["professional-blue"]
}

export function isTemplateFree(templateId: string): boolean {
  return FREE_TEMPLATES.includes(templateId)
}
