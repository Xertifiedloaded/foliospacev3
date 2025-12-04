"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CVPreview } from "@/components/cv-preview"
import type { CVData } from "@/lib/types"
import { Download, ArrowLeft, Edit, Share2, Printer } from "lucide-react"
import Link from "next/link"

export default function CVPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const cvId = params.id as string

  const [cv, setCV] = useState<CVData | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

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

  const handleExport = async () => {
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
        alert("Failed to export PDF")
      }
    } catch (error) {
      console.error("Failed to export CV:", error)
      alert("Failed to export CV")
    } finally {
      setExporting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <Skeleton className="h-9 w-9 rounded-md flex-shrink-0" />
                <Skeleton className="h-6 w-32 sm:w-48" />
              </div>
              <div className="flex gap-2 flex-shrink-0">
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

  if (!cv) {
    return null
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
                className="flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                  {cv.title}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Preview Mode
                </p>
              </div>
            </div>

            {/* Right section - Action buttons */}
            <div className="flex gap-2 flex-shrink-0">
              {/* Desktop buttons */}
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
                className="min-w-[100px] sm:min-w-[120px]"
              >
                <Download className="h-4 w-4 mr-2" />
                {exporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        {/* Info banner - mobile only */}
        <div className="sm:hidden mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
          <p className="text-xs text-blue-900 dark:text-blue-100 text-center">
            Scroll to view full CV • Tap Export to download
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="w-full mx-auto">
            <div className="">
              <CVPreview cv={cv} />
            </div>
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