"use client"

import { useEffect, useState } from "react"
import { Download, X, Crown, AlertCircle } from "lucide-react"
import TemplateSelector from "./template-selector"
import { Button } from "@/components/ui/button"

interface CVTemplateModalProps {
  cvId: string
  onClose: () => void
}

interface DownloadStatus {
  canDownload: boolean
  canChangeTemplate: boolean
  isPremium: boolean
  cvNumber: number
  totalCVs: number
  downloadLimit: number
  currentTemplate: string
}

export default function CVTemplateModal({ cvId, onClose }: CVTemplateModalProps) {
  const [cvData, setCvData] = useState<any>(null)
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("professional-blue")

  useEffect(() => {
    fetchData()
  }, [cvId])

  const fetchData = async () => {
    try {
      const [cvResponse, statusResponse] = await Promise.all([
        fetch(`/api/cvs/${cvId}`),
        fetch(`/api/cvs/${cvId}/download-status`),
      ])

      if (cvResponse.ok) {
        const cv = await cvResponse.json()
        setCvData(cv)
        setSelectedTemplate(cv.personalInfo?.selectedTemplate || "professional-blue")
      }

      if (statusResponse.ok) {
        const status = await statusResponse.json()
        setDownloadStatus(status)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!downloadStatus?.canDownload) {
      return
    }

    setDownloading(true)
    try {
      const url = `/api/cvs/${cvId}/export?template=${selectedTemplate}`
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
      a.download = `CV_${cvData?.title || "Resume"}_${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)
      onClose()
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to download CV. Please try again.")
    } finally {
      setDownloading(false)
    }
  }

  const handleUpgrade = () => {
    window.location.href = "/pricing"
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
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
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    )
  }

  if (downloadStatus && !downloadStatus.canDownload) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-xl font-bold">Upgrade Required</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 font-medium text-xs">
              This is CV #{downloadStatus.cvNumber}. On the free plan, you can only download your first{" "}
              {downloadStatus.downloadLimit} CVs.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-amber-800">Upgrade to Premium</span>
              </div>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>✓ Unlimited CV downloads</li>
                <li>✓ Access to all premium templates</li>
                <li>✓ Change templates anytime</li>
                <li>✓ Priority support</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1 text-background hover:text-white bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleUpgrade} className="flex-1 bg-amber-600 text-white hover:bg-amber-700">
                <Crown  className="w-4  h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4  shrink-0">
          <div>
            <h1 className="text-2xl font-bold capitalize text-background">{cvData.title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {downloadStatus?.isPremium
                ? "Choose a template and download your CV"
                : `Free plan: Download with ${selectedTemplate.replace(/-/g, " ")} template`}
            </p>
          </div>
          <div className="flex mt-2 justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <Button onClick={handleDownload} disabled={downloading} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              {downloading ? "Downloading..." : "Download CV"}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {downloadStatus?.canChangeTemplate ? (
            <TemplateSelector
              cvId={cvId}
              currentTemplate={selectedTemplate}
              userTier={downloadStatus.isPremium ? "PREMIUM" : "FREE"}
              onSelectTemplate={setSelectedTemplate}
            />
          ) : (
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800">
                  <strong>Free Plan:</strong> Your CV will be downloaded using the{" "}
                  <span className="font-semibold">{selectedTemplate.replace(/-/g, " ")}</span> template. Upgrade to
                  Premium to access all templates and change them anytime.
                </p>
              </div>


              <div className="text-center py-8">
                <div className="inline-block border-2 border-gray-200 rounded-lg p-8 bg-white">
                  <p className="text-lg font-medium text-gray-700 mb-2">Current Template</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{selectedTemplate.replace(/-/g, " ")}</p>
                  <p className="text-sm text-gray-500 mt-2">Ready to download</p>
                </div>
              </div>

              <div className="text-center">
                <Button onClick={handleUpgrade} variant="outline" className="mt-4 text-background bg-transparent">
                  <Crown className="w-4 h-4 mr-2 text-amber-500" />
                  Upgrade for More Templates
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
