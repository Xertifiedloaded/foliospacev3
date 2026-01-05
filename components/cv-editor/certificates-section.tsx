"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, ChevronDown, ChevronUp, Award } from "lucide-react"

interface Certificate {
  id?: string
  title: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialUrl?: string
}

interface CertificatesSectionProps {
  data: Certificate[]
  onChange: (data: Certificate[]) => void
  onNewItemAdded?: () => void
  showCertificates?: boolean
  onShowChange?: (show: boolean) => void
}

export function CertificatesSection({
  data,
  onChange,
  onNewItemAdded,
  showCertificates = false,
  onShowChange,
}: CertificatesSectionProps) {
  const [isSectionExpanded, setIsSectionExpanded] = useState(false)
  const [expandedCerts, setExpandedCerts] = useState<Set<string>>(new Set())
  const newItemRef = useRef<HTMLDivElement>(null)

  const addCertificate = () => {
    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      title: "",
      issuer: "",
      issueDate: "",
    }
    const updated = [newCert, ...data]
    onChange(updated)
    
    // Auto-expand new certificate
    setExpandedCerts(new Set([...expandedCerts, newCert.id!]))

    setTimeout(() => {
      newItemRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)

    onNewItemAdded?.()
  }

  const updateCertificate = (id: string | undefined, field: keyof Certificate, value: string) => {
    if (!id) return
    const updated = data.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert))
    onChange(updated)
  }

  const removeCertificate = (id: string | undefined) => {
    if (!id) return
    const updated = data.filter((cert) => cert.id !== id)
    onChange(updated)
    const newExpanded = new Set(expandedCerts)
    newExpanded.delete(id)
    setExpandedCerts(newExpanded)
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedCerts)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCerts(newExpanded)
  }

  const expandAll = () => {
    setExpandedCerts(new Set(data.map(c => c.id!).filter(Boolean)))
  }

  const collapseAll = () => {
    setExpandedCerts(new Set())
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  return (
    <Card className="p-2 lg:p-6">
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsSectionExpanded(!isSectionExpanded)}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Certificates</h2>
          {data.length > 0 && (
            <span className="text-sm text-muted-foreground">({data.length})</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Switch
              id="show-certificates"
              checked={showCertificates}
              onCheckedChange={onShowChange}
            />
            <Label htmlFor="show-certificates" className="text-sm cursor-pointer">
              Show in CV
            </Label>
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              addCertificate()
              setIsSectionExpanded(true)
            }} 
            size="sm" 
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
          {isSectionExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {isSectionExpanded && (
        <>
          {data.length > 1 && (
            <div className="flex gap-2 mb-4">
              <Button onClick={expandAll} size="sm" variant="ghost" className="text-xs">
                Expand All
              </Button>
              <Button onClick={collapseAll} size="sm" variant="ghost" className="text-xs">
                Collapse All
              </Button>
            </div>
          )}

          <div className="space-y-3">
            {data.map((cert, index) => {
              const isExpanded = expandedCerts.has(cert.id!)
              const expired = isExpired(cert.expiryDate)
              const isNewItem = index === 0 && expandedCerts.has(cert.id!)

              return (
                <div 
                  key={cert.id} 
                  ref={isNewItem ? newItemRef : null}
                >
                  <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
                    {/* Accordion Header */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer bg-secondary/20 hover:bg-secondary/30 transition-colors"
                      onClick={() => toggleExpand(cert.id!)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                          <Award className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {cert.title || "Untitled Certificate"}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {cert.issuer && (
                              <span className="truncate">{cert.issuer}</span>
                            )}
                            {cert.issueDate && (
                              <>
                                {cert.issuer && <span>•</span>}
                                <span>{formatDate(cert.issueDate)}</span>
                              </>
                            )}
                            {cert.expiryDate && (
                              <>
                                <span>•</span>
                                <span className={expired ? "text-destructive font-medium" : ""}>
                                  {expired ? "Expired" : `Expires ${formatDate(cert.expiryDate)}`}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeCertificate(cert.id)
                          }}
                          className="p-2 text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-md transition-colors"
                          title="Delete certificate"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Accordion Content */}
                    {isExpanded && (
                      <div className="p-4 space-y-3 border-t">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1.5 block">
                            Certificate Title *
                          </Label>
                          <Input
                            value={cert.title}
                            onChange={(e) => updateCertificate(cert.id, "title", e.target.value)}
                            placeholder="e.g., AWS Certified Solutions Architect"
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground mb-1.5 block">
                            Issuing Organization *
                          </Label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) => updateCertificate(cert.id, "issuer", e.target.value)}
                            placeholder="e.g., Amazon Web Services"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1.5 block">
                              Issue Date *
                            </Label>
                            <Input
                              type="date"
                              value={cert.issueDate}
                              onChange={(e) => updateCertificate(cert.id, "issueDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1.5 block">
                              Expiry Date (Optional)
                            </Label>
                            <Input
                              type="date"
                              value={cert.expiryDate || ""}
                              onChange={(e) => updateCertificate(cert.id, "expiryDate", e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground mb-1.5 block">
                            Credential URL (Optional)
                          </Label>
                          <Input
                            value={cert.credentialUrl || ""}
                            onChange={(e) => updateCertificate(cert.id, "credentialUrl", e.target.value)}
                            placeholder="https://www.credly.com/badges/..."
                            type="url"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Add a verification link if available
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              )
            })}

            {data.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground font-medium mb-2">No certificates yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your professional certifications and credentials
                </p>
                <Button onClick={addCertificate} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Certificate
                </Button>
              </div>
            )}
          </div>

          {!showCertificates && data.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ⚠️ Certificates are hidden from your CV. Toggle "Show in CV" to include them.
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  )
}