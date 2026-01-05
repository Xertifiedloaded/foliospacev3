"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Education } from "@/lib/types"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface EducationSectionProps {
  data: Education[]
  onChange: (data: Education[]) => void
}

export function EducationSection({ data, onChange }: EducationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
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
    <Card className="p-2 lg:p-6">
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Education</h2>
          {data.length > 0 && (
            <span className="text-sm text-muted-foreground">({data.length})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              addEducation()
              setIsExpanded(true)
            }} 
            size="sm" 
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {data.map((edu, idx) => (
            <Card key={edu.id} className="p-4 bg-secondary/20">
              <div className="flex gap-2 mb-3">
                {data.length > 1 && (
                  <>
                    <button
                      onClick={() => moveEducation(idx, Math.max(0, idx - 1))}
                      disabled={idx === 0}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveEducation(idx, Math.min(data.length - 1, idx + 1))}
                      disabled={idx === data.length - 1}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      ↓
                    </button>
                  </>
                )}
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="ml-auto text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3">
                <Input
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                  placeholder="School/University"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    placeholder="Degree (e.g., Bachelor of Science)"
                  />
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                    placeholder="Field of Study"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Start Date</label>
                    <Input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">End Date</label>
                    <div className="flex gap-2">
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        disabled={edu.current}
                      />
                      <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={edu.current}
                          onChange={(e) => updateEducation(edu.id, { current: e.target.checked })}
                        />
                        Current
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {data.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No education entries yet. Add one to get started.</p>
          )}
        </div>
      )}
    </Card>
  )
}