"use client"
import { CVPreview } from "@/components/cv-preview"
import type { CVData } from "@/lib/types"
import { Briefcase } from "lucide-react"

interface PortfolioClientProps {
  userData: {
    name: string
    email: string
    username: string
    cvs: CVData[] // Will only have 1 CV
  }
}

export default function PortfolioClient({ userData }: PortfolioClientProps) {
  const cv = userData.cvs[0]
  const { personalInfo, educations, experiences, skills, projects } = cv
  if (!cv) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {userData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold">{userData.name}</h1>
                <p className="text-muted-foreground">@{userData.username}</p>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xl sm:text-2xl font-bold text-primary">
                  {personalInfo.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                {personalInfo?.fullName && <h1 className="text-xl font-bold">{personalInfo.fullName}</h1>}
                <p className="text-xs text-blue-900">              {personalInfo.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-lg capitalize font-semibold text-foreground">{cv.title}</h2>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <CVPreview cv={cv} />
        </div>

        <div className="h-20 sm:hidden"></div>
      </main>
    </div>
  )
}