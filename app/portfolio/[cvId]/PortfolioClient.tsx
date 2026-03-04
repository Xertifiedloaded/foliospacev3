"use client"
import { CVPreview } from "@/components/cv-preview"
import type { CVData } from "@/lib/types"
import { Briefcase, AlertCircle } from "lucide-react"

interface PortfolioClientProps {
  userData: {
    name: string
    email: string
    username: string
    cvs: CVData[]
  } | null
}

export default function PortfolioClient({ userData }: PortfolioClientProps) {
  if (!userData) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold">User Not Found</h2>
            <p className="text-muted-foreground">
              This user profile doesn't exist or has been removed.
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (!userData.cvs || userData.cvs.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {userData.name?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold">{userData.name || "Unknown User"}</h1>
                <p className="text-muted-foreground">@{userData.username || "unknown"}</p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Briefcase className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No CV Found</h2>
            <p className="text-muted-foreground">
              This user hasn't created a CV yet.
            </p>
          </div>
        </main>
      </div>
    )
  }

  const cv = userData.cvs[0]

  if (!cv) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {userData.name?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold">{userData.name || "Unknown User"}</h1>
                <p className="text-muted-foreground">@{userData.username || "unknown"}</p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Briefcase className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">CV Not Found</h2>
            <p className="text-muted-foreground">
              This CV doesn't exist or has been removed.
            </p>
          </div>
        </main>
      </div>
    )
  }

  const portfolioCv: CVData = {
    ...cv,
    personalInfo:    cv.personalInfo    || {},
    educations:      cv.educations      || [],
    experiences:     cv.experiences     || [],
    skills:          cv.skills          || [],
    projects:        cv.projects        || [],
    certificates:    cv.certificates    || [],
    awards:          cv.awards          || [],
    showProjects:     true,
    showCertificates: true,
    showAwards:       true,
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="sm:max-w-7xl mx-auto sm:px-4">
        <CVPreview cv={portfolioCv} />
      </main>
    </div>
  )
}