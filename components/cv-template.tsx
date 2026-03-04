"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import TemplateSelector from "./template-selector"

interface CVTemplatePageProps {
  cvId: string
  onClose?: () => void
}

export default function CVTemplatePage({ cvId, onClose }: CVTemplatePageProps) {
  const router = useRouter()
  const [cvData, setCvData] = useState<any>(null)
  const [userTier, setUserTier] = useState<"FREE" | "PREMIUM">("FREE")
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (cvId && isOpen) {
      fetchCVData()
    }
  }, [cvId, isOpen])

  const fetchCVData = async () => {
    try {
      const cvResponse = await fetch(`/api/cvs/${cvId}`)
      if (cvResponse.ok) {
        const cvData = await cvResponse.json()
        setCvData(cvData)
      }

      const userResponse = await fetch("/api/user/profile")
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserTier(userData.subscriptionTier || "FREE")
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (templateId?: string) => {
    try {
      const template = templateId || cvData?.personalInfo?.selectedTemplate || "professional-blue"
      const url = `/api/cvs/${cvId}/export${template ? `?template=${template}` : ""}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        const error = await response.json()
        if (error.upgradeRequired) {
          alert(error.message)
          return
        }
        throw new Error(error.error || "Download failed")
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `CV_${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)
    
      setIsOpen(false)
      if (onClose) onClose()
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to download CV. Please try again.")
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 inline-flex items-center justify-center text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
        title="Choose Template"
      >
        <Download className="h-4 w-4" />
      </button>
    )
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading templates...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!cvData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">CV Not Found</h2>
            <p className="text-gray-600 mb-4">The requested CV could not be found.</p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{cvData.title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              Choose a template and download your CV
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => handleDownload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Download CV
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TemplateSelector
            cvId={cvId}
            currentTemplate={cvData.personalInfo?.selectedTemplate || "professional-blue"}
            userTier={userTier}
          />
        </div>
      </div>
    </div>
  )
}

interface CVDownloadButtonProps {
  cvId: string
}

export function CVDownloadButton({ cvId }: CVDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch(`/api/cvs/${cvId}/export`)
      
      if (!response.ok) {
        const error = await response.json()
        if (error.upgradeRequired) {
          alert(error.message)
          return
        }
        throw new Error(error.error || "Download failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `CV_${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to download CV")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <Download className="w-4 h-4" />
      {downloading ? "Downloading..." : "Download PDF"}
    </button>
  )
}