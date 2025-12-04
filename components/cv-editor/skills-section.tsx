"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Skill } from "@/lib/types"
import { Plus, X } from "lucide-react"

interface SkillsSectionProps {
  data: Skill[]
  onChange: (data: Skill[]) => void
}

export function SkillsSection({ data, onChange }: SkillsSectionProps) {
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: "intermediate",
    }
    onChange([...data, newSkill])
  }

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    onChange(data.map((skill) => (skill.id === id ? { ...skill, ...updates } : skill)))
  }

  const removeSkill = (id: string) => {
    onChange(data.filter((skill) => skill.id !== id))
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        <Button onClick={addSkill} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {data.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30"
          >
            <span className="text-sm">{skill.name || "Skill"}</span>
            <button onClick={() => removeSkill(skill.id)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {data.map((skill) => (
          <div key={skill.id} className="flex gap-2">
            <Input
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
              placeholder="Skill name (e.g., React, Project Management)"
            />
            <select
              value={skill.level}
              onChange={(e) =>
                updateSkill(skill.id, {
                  level: e.target.value as "beginner" | "intermediate" | "advanced" | "expert",
                })
              }
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <p className="text-center text-muted-foreground py-4">No skills yet. Add some to highlight your expertise.</p>
      )}
    </Card>
  )
}
