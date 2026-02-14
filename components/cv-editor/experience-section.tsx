"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Experience } from "@/lib/types"
import { Plus, Trash2, ChevronDown, ChevronUp, Briefcase, MoveUp, MoveDown, Calendar } from "lucide-react"

interface ExperienceSectionProps {
  data: Experience[]
  onChange: (data: Experience[]) => void
  onNewItemAdded?: () => void
}

export function ExperienceSection({ data, onChange, onNewItemAdded }: ExperienceSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    onChange([...data, newExp])
    setIsExpanded(true)
    onNewItemAdded?.()
  }

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    onChange(data.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)))
  }

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id))
  }

  const moveExperience = (fromIdx: number, toIdx: number) => {
    const newData = [...data]
    const [moved] = newData.splice(fromIdx, 1)
    newData.splice(toIdx, 0, moved)
    onChange(newData)
  }

  return (
    <Card className="p-4 sm:p-5 md:p-6 border-border/50 hover:border-primary/30 transition-colors">
      {/* Section Header */}
      <div 
        className="flex items-center justify-between mb-4 sm:mb-5 pb-3 sm:pb-4 border-b cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10">
            <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg md:text-xl font-bold">Experience</h2>
            {data.length > 0 && (
              <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {data.length}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              addExperience()
            }} 
            size="sm"
            className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add</span>
            <span className="sm:hidden">Add</span>
          </Button>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 sm:space-y-4">
          {data.map((exp, idx) => (
            <Card key={exp.id} className="p-3 sm:p-4 bg-secondary/20 border-border/50">
              {/* Item Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
                <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground px-1.5 sm:px-2">
                    #{idx + 1}
                  </span>
                </div>
                {data.length > 1 && (
                  <>
                    <Button
                      onClick={() => moveExperience(idx, Math.max(0, idx - 1))}
                      disabled={idx === 0}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 sm:h-8 sm:w-8"
                      title="Move up"
                    >
                      <MoveUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </Button>
                    <Button
                      onClick={() => moveExperience(idx, Math.min(data.length - 1, idx + 1))}
                      disabled={idx === data.length - 1}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 sm:h-8 sm:w-8"
                      title="Move down"
                    >
                      <MoveDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => removeExperience(exp.id)}
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </div>

              <div className="grid gap-2.5 sm:gap-3">
                {/* Position & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                      Job Title
                    </label>
                    <Input
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                      placeholder="Senior Software Engineer"
                      className="h-8 sm:h-9 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                      Company
                    </label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      placeholder="Tech Company Inc."
                      className="h-8 sm:h-9 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Start Date
                    </label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      className="h-8 sm:h-9 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      End Date
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        disabled={exp.current}
                        className="h-8 sm:h-9 text-sm sm:text-base flex-1"
                      />
                      <label className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap bg-muted px-2 sm:px-3 rounded-md">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                          className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                        />
                        <span className="hidden sm:inline">Current</span>
                        <span className="sm:hidden">Now</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                    Description
                  </label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                    placeholder="• Led team of 5 engineers&#10;• Increased performance by 50%&#10;• Implemented new features..."
                    rows={3}
                    className="text-sm sm:text-base resize-none"
                  />
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                    Use bullet points to highlight key achievements
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {data.length === 0 && (
            <div className="text-center py-8 sm:py-10 md:py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-500/10 mb-3 sm:mb-4">
                <Briefcase className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-1">No experience entries yet</p>
              <p className="text-xs sm:text-sm text-muted-foreground/80">
                Click "Add" to create your first entry
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}