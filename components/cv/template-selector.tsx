"use client"

import { useState, useEffect } from "react"
import { Check, Lock, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Template {
  id: string
  name: string
  description: string
  tier: "FREE" | "PREMIUM"
  style: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
  }
}

interface TemplateSelectorProps {
  cvId: string
  currentTemplate: string
  userTier: "FREE" | "PREMIUM"
  onSelectTemplate?: (templateId: string) => void
}

export default function TemplateSelector({ cvId, currentTemplate, userTier, onSelectTemplate }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates")
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTemplate = async (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template?.tier === "PREMIUM" && userTier !== "PREMIUM") {
      return 
    }
    if (userTier !== "PREMIUM") {
      return
    }

    setSelectedTemplate(templateId)
    setSaving(true)

    try {
      const response = await fetch(`/api/cvs/${cvId}/template`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.upgradeRequired) {
          alert(error.message)
          setSelectedTemplate(currentTemplate)
        }
      } else {
        onSelectTemplate?.(templateId)
      }
    } catch (error) {
      console.error("Failed to update template:", error)
      setSelectedTemplate(currentTemplate)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading templates...</p>
      </div>
    )
  }

  const freeTemplates = templates.filter((t) => t.tier === "FREE")
  const premiumTemplates = templates.filter((t) => t.tier === "PREMIUM")

  return (
    <div className="p-6 space-y-8">
      {userTier === "FREE" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Crown className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">Free Plan Limitations</h3>
              <p className="text-sm text-amber-700 mt-1">
                You can download your first 3 CVs using free templates. Upgrade to Premium to unlock all templates and
                unlimited downloads.
              </p>
            </div>
          </div>
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Free Templates</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {freeTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              canSelect={true}
              isPremiumUser={userTier === "PREMIUM"}
              onSelect={() => handleSelectTemplate(template.id)}
              disabled={saving || userTier === "FREE"}
            />
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Premium Templates</h3>
          <Crown className="w-5 h-5 text-amber-500" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {premiumTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              canSelect={userTier === "PREMIUM"}
              isPremiumUser={userTier === "PREMIUM"}
              onSelect={() => handleSelectTemplate(template.id)}
              disabled={saving}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface TemplateCardProps {
  template: Template
  isSelected: boolean
  canSelect: boolean
  isPremiumUser: boolean
  onSelect: () => void
  disabled?: boolean
}

function TemplateCard({ template, isSelected, canSelect, isPremiumUser, onSelect, disabled }: TemplateCardProps) {
  const isPremiumTemplate = template.tier === "PREMIUM"
  const isLocked = isPremiumTemplate && !isPremiumUser

  return (
    <button
      onClick={onSelect}
      disabled={disabled || isLocked || !isPremiumUser}
      className={cn(
        "relative rounded-lg border-2 p-4 text-left transition-all",
        isSelected ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20" : "border-gray-200 hover:border-gray-300",
        (isLocked || !isPremiumUser) && "opacity-70 cursor-not-allowed",
        disabled && "opacity-50",
      )}
    >
      <div className="flex gap-1 mb-3">
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: template.style.primaryColor }} />
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: template.style.secondaryColor }} />
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: template.style.accentColor }} />
      </div>

      <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</p>

      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      {isLocked && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
          <Lock className="w-3 h-3 text-white" />
        </div>
      )}
      {isPremiumTemplate && (
        <div className="absolute bottom-2 right-2">
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Premium</span>
        </div>
      )}
    </button>
  )
}
