"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CVPreview } from "@/components/cv-preview"
import type { CVData } from "@/lib/types"
import { Download, ArrowLeft, Edit, Printer, AlertCircle, FileX } from "lucide-react"
import Link from "next/link"

export default function CVPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const cvId = params?.id as string

  const [cv, setCV] = useState<CVData | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && cvId) {
      fetchCV()
    } else if (user && !cvId) {
      setError("Invalid CV ID")
      setLoading(false)
    }
  }, [user, cvId])

  const fetchCV = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/cvs/${cvId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("CV not found")
        } else if (response.status === 403) {
          setError("You don't have permission to view this CV")
        } else {
          setError("Failed to load CV")
        }
        setLoading(false)
        return
      }

      const data = await response.json()
      
  
      if (!data || typeof data !== 'object') {
        setError("Invalid CV data")
        setLoading(false)
        return
      }

      setCV({
        ...data,
        personalInfo: data.personalInfo || {},
        educations: data.educations || [],
        experiences: data.experiences || [],
        skills: data.skills || [],
        projects: data.projects || [],
        title: data.title || "Untitled CV"
      })
    } catch (error) {
      console.error("Failed to fetch CV:", error)
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (!cv || !cvId) return
    
    setExporting(true)
    try {
      const response = await fetch(`/api/cvs/${cvId}/export`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url

        const disposition = response.headers.get("content-disposition")
        let filename = "cv.pdf"
        if (disposition) {
          const filenamePart = disposition.split("filename=")[1]
          if (filenamePart) {
            filename = filenamePart.replace(/"/g, "")
          }
        }

        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        alert("Failed to export PDF. Please try again.")
      }
    } catch (error) {
      console.error("Failed to export CV:", error)
      alert("Failed to export CV. Please check your connection.")
    } finally {
      setExporting(false)
    }
  }

  const handlePrint = () => {
    if (cv) {
      window.print()
    }
  }

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <Skeleton className="h-9 w-9 rounded-md shrink-0" />
                <Skeleton className="h-6 w-32 sm:w-48" />
              </div>
              <div className="flex gap-2 shrink-0">
                <Skeleton className="h-9 w-16 sm:w-20 hidden sm:block" />
                <Skeleton className="h-9 w-9 sm:hidden" />
                <Skeleton className="h-9 w-24 sm:w-32" />
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="bg-card rounded-lg shadow-lg p-6 sm:p-12 space-y-6">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-36 mx-auto" />
            <div className="space-y-4 mt-8">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push("/dashboard")}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg sm:text-xl font-bold">CV Preview</h1>
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-950/20 rounded-full flex items-center justify-center">
              {error === "CV not found" ? (
                <FileX className="h-10 w-10 text-red-600 dark:text-red-400" />
              ) : (
                <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
              )}
            </div>
            <h2 className="text-xl font-semibold">{error}</h2>
            <p className="text-muted-foreground">
              {error === "CV not found" 
                ? "This CV doesn't exist or has been deleted."
                : "Please try again or contact support if the problem persists."}
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <Button 
                variant="outline" 
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              {error !== "CV not found" && error !== "You don't have permission to view this CV" && (
                <Button onClick={fetchCV}>
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    )
  }

  // No CV data state
  if (!cv) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push("/dashboard")}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg sm:text-xl font-bold">CV Preview</h1>
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
              <FileX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No CV Data</h2>
            <p className="text-muted-foreground">
              Unable to load CV data.
            </p>
            <Button 
              variant="outline" 
              onClick={() => router.push("/dashboard")}
              className="mt-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card sticky top-0 z-10 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg capitalize sm:text-xl lg:text-2xl font-bold truncate">
                  {cv.title || "Untitled CV"}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Preview Mode
                </p>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrint}
                className="hidden lg:flex"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              
              <Link href={`/cv/${cvId}/edit`}>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>

              <Link href={`/cv/${cvId}/edit`} className="sm:hidden">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>

              <Button 
                onClick={handleExport} 
                disabled={exporting}
                size="sm"
                className="min-w-[100px] text-xs sm:min-w-[120px]"
              >
                <Download className="h-3 w-3 mr-2" />
                {exporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        <div className="sm:hidden mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
          <p className="text-xs text-blue-900 dark:text-blue-100 text-center">
            Scroll to view full CV • Tap Export to download
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="w-full mx-auto">
            <CVPreview cv={cv} />
          </div>
        </div>

        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg print:hidden">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePrint}
              className="flex-1"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Link href={`/cv/${cvId}/edit`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        <div className="h-20 sm:hidden"></div>
      </main>
    </div>
  )
}