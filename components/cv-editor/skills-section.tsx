"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Skill } from "@/lib/types"
import { Plus, X, ChevronDown, ChevronUp, Zap, Star } from "lucide-react"

interface SkillsSectionProps {
  data: Skill[]
  onChange: (data: Skill[]) => void
}

export function SkillsSection({ data, onChange }: SkillsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: "intermediate",
    }
    onChange([...data, newSkill])
    setIsExpanded(true)
  }

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    onChange(data.map((skill) => (skill.id === id ? { ...skill, ...updates } : skill)))
  }

  const removeSkill = (id: string) => {
    onChange(data.filter((skill) => skill.id !== id))
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400"
      case "intermediate": return "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
      case "advanced": return "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400"
      case "expert": return "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-400"
      default: return "bg-accent/20 border-accent/30"
    }
  }

  return (
    <Card className="p-4 sm:p-5 md:p-6 border-border/50 hover:border-primary/30 transition-colors">
      {/* Section Header */}
      <div 
        className="flex items-center justify-between mb-4 sm:mb-5 pb-3 sm:pb-4 border-b cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/10">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg md:text-xl font-bold">Skills</h2>
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
              addSkill()
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
        <>
          {/* Skills Preview Pills */}
          {data.length > 0 && (
            <div className="mb-4 sm:mb-5 pb-3 sm:pb-4 border-b">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-2 sm:mb-3 uppercase tracking-wider">
                Your Skills
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {data.map((skill) => (
                  <div
                    key={skill.id}
                    className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border ${getLevelColor(skill.level)} transition-all hover:scale-105`}
                  >
                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span className="text-[11px] sm:text-xs font-medium">
                      {skill.name || "Untitled"}
                    </span>
                    <button 
                      onClick={() => removeSkill(skill.id)} 
                      className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Editor */}
          <div className="space-y-2 sm:space-y-2.5">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Edit Skills
            </p>
            {data.map((skill, idx) => (
              <div key={skill.id} className="flex flex-col sm:flex-row gap-2 p-2.5 sm:p-3 bg-secondary/20 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground bg-muted px-1.5 sm:px-2 py-0.5 rounded">
                    #{idx + 1}
                  </span>
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                    placeholder="e.g., React, Python, Leadership"
                    className="h-8 sm:h-9 text-xs sm:text-sm flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={skill.level}
                    onChange={(e) =>
                      updateSkill(skill.id, {
                        level: e.target.value as "beginner" | "intermediate" | "advanced" | "expert",
                      })
                    }
                    className="h-8 sm:h-9 px-2 sm:px-3 rounded-md border border-input bg-background text-[11px] sm:text-sm flex-1 sm:flex-none sm:w-32"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                  <Button
                    onClick={() => removeSkill(skill.id)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:hidden text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {data.length === 0 && (
            <div className="text-center py-8 sm:py-10 md:py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-500/10 mb-3 sm:mb-4">
                <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-orange-600" />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-1">No skills added yet</p>
              <p className="text-xs sm:text-sm text-muted-foreground/80">
                Showcase your expertise by adding your skills
              </p>
            </div>
          )}

          {/* Helper Text */}
          {data.length > 0 && (
            <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-3 sm:mt-4 pt-3 sm:pt-4 border-t text-center">
              💡 Tip: List your most relevant skills first. Skills are color-coded by proficiency level.
            </p>
          )}
        </>
      )}
    </Card>
  )
}