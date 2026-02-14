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
import { Save, ArrowLeft, ArrowRight, CheckCircle2, User, Briefcase, GraduationCap, Code, FolderKanban, Award, Medal } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const STEPS = [
  { id: 1, name: "Personal Info", icon: User },
  { id: 2, name: "Experience", icon: Briefcase },
  { id: 3, name: "Education", icon: GraduationCap },
  { id: 4, name: "Skills", icon: Code },
  { id: 5, name: "Projects", icon: FolderKanban },
  { id: 6, name: "Certificates", icon: Award },
  { id: 7, name: "Awards", icon: Medal },
]

export default function CVEditorPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const cvId = params.id as string

  const [cv, setCV] = useState<CVData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
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
    setSaved(false)
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
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        alert("Failed to save CV")
      }
    } catch (error) {
      console.error("Failed to save CV:", error)
      alert("Failed to save CV")
    } finally {
      setSaving(false)
    }
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
      sectionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      sectionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading your CV...</p>
      </div>
    )
  }

  if (!cv) {
    return null
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-card/95 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-base capitalize sm:text-lg md:text-xl lg:text-2xl font-bold truncate">
                  {cv.title}
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].name}
                </p>
              </div>
            </div>

  
            <Button 
              onClick={saveCV} 
              disabled={saving || saved}
              className="h-8 sm:h-9 md:h-10 px-3 sm:px-4 md:px-6 text-xs sm:text-sm shrink-0"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Saved</span>
                  <span className="sm:hidden">✓</span>
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
                  <span className="sm:hidden">{saving ? "..." : "Save"}</span>
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="h-1.5 sm:h-2" />
            
            <div className="hidden md:flex items-center justify-between">
              {STEPS.map((step) => {
                const StepIcon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex flex-col items-center gap-1 transition-all ${
                      isActive ? "scale-110" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted ? "bg-green-500 text-white" :
                      isActive ? "bg-primary text-primary-foreground" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>
                    <span className={`text-[10px] font-medium ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {step.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Step Indicators - Mobile */}
            <div className="flex md:hidden items-center gap-1 overflow-x-auto pb-2">
              {STEPS.map((step) => {
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex-shrink-0 w-2 h-2 rounded-full transition-all ${
                      isCompleted ? "bg-green-500 w-3" :
                      isActive ? "bg-primary w-4" :
                      "bg-muted"
                    }`}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-1 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8" ref={sectionsRef}>
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {currentStep === 1 && (
            <PersonalInfoSection 
              data={cv.personalInfo} 
              onChange={(data) => setCV({ ...cv, personalInfo: data })} 
            />
          )}

          {currentStep === 2 && (
            <ExperienceSection
              data={cv.experiences}
              onChange={(data) => setCV({ ...cv, experiences: data })}
            />
          )}

          {currentStep === 3 && (
            <EducationSection
              data={cv.educations}
              onChange={(data) => setCV({ ...cv, educations: data })}
            />
          )}

          {currentStep === 4 && (
            <SkillsSection 
              data={cv.skills} 
              onChange={(data) => setCV({ ...cv, skills: data })} 
            />
          )}

          {currentStep === 5 && (
            <ProjectsSection
              data={cv.projects}
              onChange={(data) => setCV({ ...cv, projects: data })}
              showProjects={cv.showProjects}
              onShowChange={(show) => setCV({ ...cv, showProjects: show })}
            />
          )}

          {currentStep === 6 && (
            <CertificatesSection
              data={cv.certificates}
              onChange={(data) => setCV({ ...cv, certificates: data })}
              showCertificates={cv.showCertificates}
              onShowChange={(show) => setCV({ ...cv, showCertificates: show })}
            />
          )}

          {currentStep === 7 && (
            <AwardsSection
              data={cv.awards}
              onChange={(data) => setCV({ ...cv, awards: data })}
              showAwards={cv.showAwards}
              onShowChange={(show) => setCV({ ...cv, showAwards: show })}
            />
          )}

          {/* Navigation Buttons */}
          <div className="hidden lg:flex items-center justify-between gap-4 pt-4 border-t">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
              className="h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                onClick={saveCV}
                disabled={saving || saved}
                variant="outline"
                className="h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base"
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save"}
                  </>
                )}
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  onClick={nextStep}
                  className="h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Finish</span>
                  <span className="sm:hidden">Done</span>
                </Button>
              )}
            </div>
          </div>

          <div className="h-20 sm:h-4" />
        </div>
      </main>


<div className="sm:hidden fixed bottom-0 left-0 right-0 p-2 bg-card/95 backdrop-blur-xl border-t shadow-lg z-10">
        <div className="flex items-center gap-1.5">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
            size="sm"
            className="flex-1 h-9 text-xs font-medium"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Previous
          </Button>

          <Button
            onClick={saveCV}
            disabled={saving || saved}
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
          >
            {saved ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              onClick={nextStep}
              size="sm"
              className="flex-1 h-9 text-xs font-medium"
            >
              Next
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/dashboard")}
              size="sm"
              className="flex-1 h-9 text-xs font-medium"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Finish
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}