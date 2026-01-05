"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, ChevronDown, ChevronUp, Award } from "lucide-react"

interface AwardType {
  id?: string
  title: string
  organization: string
  awardDate: string
  description?: string
}

interface AwardsSectionProps {
  data: AwardType[]
  onChange: (data: AwardType[]) => void
  onNewItemAdded?: () => void
  showAwards?: boolean
  onShowChange?: (show: boolean) => void
}

export function AwardsSection({
  data,
  onChange,
  onNewItemAdded,
  showAwards = false,
  onShowChange,
}: AwardsSectionProps) {
  const [isSectionExpanded, setIsSectionExpanded] = useState(false)
  const [expandedAwards, setExpandedAwards] = useState<Set<string>>(new Set())
  const newItemRef = useRef<HTMLDivElement>(null)

  const addAward = () => {
    const newAward: AwardType = {
      id: `award-${Date.now()}`,
      title: "",
      organization: "",
      awardDate: "",
    }
    const updated = [newAward, ...data]
    onChange(updated)
    
    setExpandedAwards(new Set([...expandedAwards, newAward.id!]))

    setTimeout(() => {
      newItemRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)

    onNewItemAdded?.()
  }

  const updateAward = (id: string | undefined, field: keyof AwardType, value: string) => {
    if (!id) return
    const updated = data.map((award) => (award.id === id ? { ...award, [field]: value } : award))
    onChange(updated)
  }

  const removeAward = (id: string | undefined) => {
    if (!id) return
    const updated = data.filter((award) => award.id !== id)
    onChange(updated)
    const newExpanded = new Set(expandedAwards)
    newExpanded.delete(id)
    setExpandedAwards(newExpanded)
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedAwards)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedAwards(newExpanded)
  }

  const expandAll = () => {
    setExpandedAwards(new Set(data.map(a => a.id!).filter(Boolean)))
  }

  const collapseAll = () => {
    setExpandedAwards(new Set())
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <Card className="p-2 lg:p-6">
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsSectionExpanded(!isSectionExpanded)}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Awards</h2>
          {data.length > 0 && (
            <span className="text-sm text-muted-foreground">({data.length})</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Switch
              id="show-awards"
              checked={showAwards}
              onCheckedChange={onShowChange}
            />
            <Label htmlFor="show-awards" className="text-sm cursor-pointer">
              Show in CV
            </Label>
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              addAward()
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
            {data.map((award, index) => {
              const isExpanded = expandedAwards.has(award.id!)
              const isNewItem = index === 0 && expandedAwards.has(award.id!)

              return (
                <div 
                  key={award.id} 
                  ref={isNewItem ? newItemRef : null}
                >
                  <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
                    {/* Accordion Header */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer bg-secondary/20 hover:bg-secondary/30 transition-colors"
                      onClick={() => toggleExpand(award.id!)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                          <Award className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {award.title || "Untitled Award"}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {award.organization && (
                              <span className="truncate">{award.organization}</span>
                            )}
                            {award.awardDate && (
                              <>
                                {award.organization && <span>•</span>}
                                <span>{formatDate(award.awardDate)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeAward(award.id)
                          }}
                          className="p-2 text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-md transition-colors"
                          title="Delete award"
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
                            Award Title *
                          </Label>
                          <Input
                            value={award.title}
                            onChange={(e) => updateAward(award.id, "title", e.target.value)}
                            placeholder="e.g., Employee of the Year"
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground mb-1.5 block">
                            Organization *
                          </Label>
                          <Input
                            value={award.organization}
                            onChange={(e) => updateAward(award.id, "organization", e.target.value)}
                            placeholder="e.g., Company Name"
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground mb-1.5 block">
                            Award Date *
                          </Label>
                          <Input
                            type="date"
                            value={award.awardDate}
                            onChange={(e) => updateAward(award.id, "awardDate", e.target.value)}
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground mb-1.5 block">
                            Description (Optional)
                          </Label>
                          <Textarea
                            value={award.description || ""}
                            onChange={(e) => updateAward(award.id, "description", e.target.value)}
                            placeholder="Describe the significance of this award..."
                            rows={3}
                            className="resize-none"
                          />
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
                <p className="text-muted-foreground font-medium mb-2">No awards yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your professional achievements and recognition
                </p>
                <Button onClick={addAward} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Award
                </Button>
              </div>
            )}
          </div>

          {!showAwards && data.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ⚠️ Awards are hidden from your CV. Toggle "Show in CV" to include them.
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  )
}