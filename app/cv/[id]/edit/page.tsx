"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PersonalInfoSection } from "@/components/cv-editor/personal-info-section"
import { ExperienceSection } from "@/components/cv-editor/experience-section"
import { EducationSection } from "@/components/cv-editor/education-section"
import { SkillsSection } from "@/components/cv-editor/skills-section"
import { ProjectsSection } from "@/components/cv-editor/projects-section"
import { CertificatesSection } from "@/components/cv-editor/certificates-section"
import { AwardsSection } from "@/components/cv-editor/awards-section"
import type { CVData } from "@/lib/types"
import { Save, ArrowLeft } from "lucide-react"

export default function CVEditorPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const cvId = params.id as string

  const [cv, setCV] = useState<CVData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const sectionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && cvId) {
      fetchCV()
    }
  }, [user, cvId])

  const fetchCV = async () => {
    try {
      const response = await fetch(`/api/cvs/${cvId}`)
      if (response.ok) {
        const data = await response.json()
        setCV({
          ...data,
          personalInfo: data.personalInfo || {},
          educations: data.educations || [],
          experiences: data.experiences || [],
          skills: data.skills || [],
          projects: data.projects || [],
          certificates: data.certificates || [],
          awards: data.awards || [],
          showProjects: data.showProjects ?? false,
          showCertificates: data.showCertificates ?? false,
          showAwards: data.showAwards ?? false,
        })
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Failed to fetch CV:", error)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const saveCV = async () => {
    if (!cv) return

    setSaving(true)
    try {
      const response = await fetch(`/api/cvs/${cvId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalInfo: cv.personalInfo,
          educations: cv.educations,
          experiences: cv.experiences,
          skills: cv.skills,
          projects: cv.projects,
          certificates: cv.certificates,
          awards: cv.awards,
          showProjects: cv.showProjects,
          showCertificates: cv.showCertificates,
          showAwards: cv.showAwards,
        }),
      })

      if (response.ok) {
        alert("CV saved successfully!")
      }
    } catch (error) {
      console.error("Failed to save CV:", error)
      alert("Failed to save CV")
    } finally {
      setSaving(false)
    }
  }

  const scrollToSectionsTop = () => {
    sectionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!cv) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{cv.title}</h1>
          </div>
          <Button onClick={saveCV} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto lg:px-6 py-8" ref={sectionsRef}>
        <div className="space-y-8">
          <PersonalInfoSection data={cv.personalInfo} onChange={(data) => setCV({ ...cv, personalInfo: data })} />

          <ExperienceSection
            data={cv.experiences}
            onChange={(data) => setCV({ ...cv, experiences: data })}
            onNewItemAdded={scrollToSectionsTop}
          />

          <EducationSection
            data={cv.educations}
            onChange={(data) => setCV({ ...cv, educations: data })}
            onNewItemAdded={scrollToSectionsTop}
          />

          <SkillsSection data={cv.skills} onChange={(data) => setCV({ ...cv, skills: data })} />

          <ProjectsSection
            data={cv.projects}
            onChange={(data) => setCV({ ...cv, projects: data })}
            onNewItemAdded={scrollToSectionsTop}
            showProjects={cv.showProjects}
            onShowChange={(show) => setCV({ ...cv, showProjects: show })}
          />

          <CertificatesSection
            data={cv.certificates}
            onChange={(data) => setCV({ ...cv, certificates: data })}
            onNewItemAdded={scrollToSectionsTop}
            showCertificates={cv.showCertificates}
            onShowChange={(show) => setCV({ ...cv, showCertificates: show })}
          />

          <AwardsSection
            data={cv.awards}
            onChange={(data) => setCV({ ...cv, awards: data })}
            onNewItemAdded={scrollToSectionsTop}
            showAwards={cv.showAwards}
            onShowChange={(show) => setCV({ ...cv, showAwards: show })}
          />
        </div>
      </main>
    </div>
  )
}
