"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Education } from "@/lib/types"
import { Plus, Trash2, ChevronDown, ChevronUp, GraduationCap, MoveUp, MoveDown, Calendar } from "lucide-react"
import { useState } from "react"

interface EducationSectionProps {
  data: Education[]
  onChange: (data: Education[]) => void
  onNewItemAdded?: () => void
}

export function EducationSection({ data, onChange, onNewItemAdded }: EducationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
    }
    onChange([...data, newEdu])
    setIsExpanded(true)
    onNewItemAdded?.()
  }

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onChange(data.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu)))
  }

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id))
  }

  const moveEducation = (fromIdx: number, toIdx: number) => {
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
          <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10">
            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg md:text-xl font-bold">Education</h2>
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
              addEducation()
            }} 
            size="sm"
            className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span>Add</span>
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
          {data.map((edu, idx) => (
            <Card key={edu.id} className="p-3 sm:p-4 bg-secondary/20 border-border/50">
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
                      onClick={() => moveEducation(idx, Math.max(0, idx - 1))}
                      disabled={idx === 0}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 sm:h-8 sm:w-8"
                      title="Move up"
                    >
                      <MoveUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </Button>
                    <Button
                      onClick={() => moveEducation(idx, Math.min(data.length - 1, idx + 1))}
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
                  onClick={() => removeEducation(edu.id)}
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </div>

              <div className="grid gap-2.5 sm:gap-3">
                {/* School */}
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                    School/University
                  </label>
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                    placeholder="Harvard University"
                    className="h-8 sm:h-9 text-sm sm:text-base"
                  />
                </div>

                {/* Degree & Field */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                      Degree
                    </label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      placeholder="Bachelor of Science"
                      className="h-8 sm:h-9 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                      Field of Study
                    </label>
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                      placeholder="Computer Science"
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
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      className="h-8 sm:h-9 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      End Date / Expected
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        disabled={edu.current}
                        className="h-8 sm:h-9 text-sm sm:text-base flex-1"
                      />
                      <label className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap bg-muted px-2 sm:px-3 rounded-md">
                        <input
                          type="checkbox"
                          checked={edu.current}
                          onChange={(e) => updateEducation(edu.id, { current: e.target.checked })}
                          className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                        />
                        <span className="hidden sm:inline">Current</span>
                        <span className="sm:hidden">Now</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Empty State */}
          {data.length === 0 && (
            <div className="text-center py-8 sm:py-10 md:py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-500/10 mb-3 sm:mb-4">
                <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-1">No education entries yet</p>
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