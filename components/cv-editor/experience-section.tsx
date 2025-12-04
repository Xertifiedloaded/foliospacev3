"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Experience } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"

interface ExperienceSectionProps {
  data: Experience[]
  onChange: (data: Experience[]) => void
}

export function ExperienceSection({ data, onChange }: ExperienceSectionProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null)

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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Experience</h2>
        <Button onClick={addExperience} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="space-y-4">
        {data.map((exp, idx) => (
          <Card key={exp.id} className="p-4 bg-secondary/20">
            <div className="flex gap-2 mb-3">
              {data.length > 1 && (
                <>
                  <button
                    onClick={() => moveExperience(idx, Math.max(0, idx - 1))}
                    disabled={idx === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveExperience(idx, Math.min(data.length - 1, idx + 1))}
                    disabled={idx === data.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    ↓
                  </button>
                </>
              )}
              <button
                onClick={() => removeExperience(exp.id)}
                className="ml-auto text-destructive hover:text-destructive/80"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                  placeholder="Job Title"
                />
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  placeholder="Company"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Start Date</label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">End Date</label>
                  <div className="flex gap-2">
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                      disabled={exp.current}
                    />
                    <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                      />
                      Current
                    </label>
                  </div>
                </div>
              </div>

              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
              />
            </div>
          </Card>
        ))}

        {data.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No experience entries yet. Add one to get started.</p>
        )}
      </div>
    </Card>
  )
}
