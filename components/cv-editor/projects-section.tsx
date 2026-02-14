"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Project } from "@/lib/types"
import { Plus, Trash2, ChevronDown, ChevronUp, Folder, Link2, Code2, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface ProjectsSectionProps {
  data: Project[]
  onChange: (data: Project[]) => void
  onNewItemAdded?: () => void
  showProjects: boolean
  onShowChange: (show: boolean) => void
}

export function ProjectsSection({ 
  data, 
  onChange, 
  onNewItemAdded,
  showProjects,
  onShowChange 
}: ProjectsSectionProps) {
  const [isSectionExpanded, setIsSectionExpanded] = useState(true)
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      url: "",
      technologies: [],
    }
    onChange([...data, newProject])
    setExpandedProjects(new Set([...expandedProjects, newProject.id]))
    setIsSectionExpanded(true)
    onNewItemAdded?.()
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange(data.map((proj) => (proj.id === id ? { ...proj, ...updates } : proj)))
  }

  const removeProject = (id: string) => {
    onChange(data.filter((proj) => proj.id !== id))
    const newExpanded = new Set(expandedProjects)
    newExpanded.delete(id)
    setExpandedProjects(newExpanded)
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedProjects)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedProjects(newExpanded)
  }

  const expandAll = () => {
    setExpandedProjects(new Set(data.map(p => p.id)))
  }

  const collapseAll = () => {
    setExpandedProjects(new Set())
  }

  return (
    <Card className="p-4 sm:p-5 md:p-6 border-border/50 hover:border-primary/30 transition-colors">
      {/* Section Header */}
      <div 
        className="flex items-center justify-between mb-4 sm:mb-5 pb-3 sm:pb-4 border-b cursor-pointer"
        onClick={() => setIsSectionExpanded(!isSectionExpanded)}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-teal-500/10">
            <Folder className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg md:text-xl font-bold">Projects</h2>
            {data.length > 0 && (
              <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {data.length}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2" onClick={(e) => e.stopPropagation()}>
            <Switch
              id="show-projects"
              checked={showProjects}
              onCheckedChange={onShowChange}
              className="scale-75 sm:scale-100"
            />
            <Label htmlFor="show-projects" className="text-xs sm:text-sm cursor-pointer hidden sm:inline">
              Show in CV
            </Label>
            {showProjects ? (
              <Eye className="h-3.5 w-3.5 sm:hidden text-green-600" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 sm:hidden text-muted-foreground" />
            )}
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              addProject()
            }} 
            size="sm"
            className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span>Add</span>
          </Button>
          {isSectionExpanded ? (
            <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {isSectionExpanded && (
        <>
          {/* Expand/Collapse Controls */}
          {data.length > 1 && (
            <div className="flex gap-2 mb-3 sm:mb-4">
              <Button 
                onClick={expandAll} 
                size="sm" 
                variant="ghost" 
                className="h-7 sm:h-8 text-[10px] sm:text-xs px-2 sm:px-3"
              >
                Expand All
              </Button>
              <Button 
                onClick={collapseAll} 
                size="sm" 
                variant="ghost" 
                className="h-7 sm:h-8 text-[10px] sm:text-xs px-2 sm:px-3"
              >
                Collapse All
              </Button>
            </div>
          )}

          <div className="space-y-2.5 sm:space-y-3">
            {data.map((project, index) => {
              const isExpanded = expandedProjects.has(project.id)

              return (
                <Card key={project.id} className="overflow-hidden border border-border/50 hover:border-primary/30 transition-colors">
                  {/* Accordion Header */}
                  <div
                    className="flex items-center justify-between p-2.5 sm:p-3 md:p-4 cursor-pointer bg-secondary/20 hover:bg-secondary/30 transition-colors"
                    onClick={() => toggleExpand(project.id)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-teal-500/10 text-teal-600 font-semibold text-[10px] sm:text-xs md:text-sm shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate text-xs sm:text-sm md:text-base">
                          {project.name || "Untitled Project"}
                        </h3>
                        {!isExpanded && project.technologies.length > 0 && (
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate flex items-center gap-1">
                            <Code2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                            {project.technologies.slice(0, 3).join(", ")}
                            {project.technologies.length > 3 && "..."}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeProject(project.id)
                        }}
                        className="p-1.5 sm:p-2 text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="p-2.5 sm:p-3 md:p-4 space-y-2.5 sm:space-y-3 border-t bg-background">
                      <div className="space-y-1 sm:space-y-1.5">
                        <Label className="text-[10px] sm:text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Folder className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          Project Name *
                        </Label>
                        <Input
                          value={project.name}
                          onChange={(e) => updateProject(project.id, { name: e.target.value })}
                          placeholder="E.g., E-commerce Platform"
                          className="h-8 sm:h-9 text-sm sm:text-base"
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-1.5">
                        <Label className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                          Description *
                        </Label>
                        <Textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, { description: e.target.value })}
                          placeholder="Describe what you built, your role, and the impact..."
                          rows={3}
                          className="resize-none text-sm sm:text-base"
                        />
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                          Highlight key features and your contributions
                        </p>
                      </div>

                      <div className="space-y-1 sm:space-y-1.5">
                        <Label className="text-[10px] sm:text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Code2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          Technologies Used *
                        </Label>
                        <Input
                          value={project.technologies.join(", ")}
                          onChange={(e) =>
                            updateProject(project.id, {
                              technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                            })
                          }
                          placeholder="React, Node.js, MongoDB, AWS"
                          className="h-8 sm:h-9 text-sm sm:text-base"
                        />
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                          Separate technologies with commas
                        </p>
                      </div>

                      <div className="space-y-1 sm:space-y-1.5">
                        <Label className="text-[10px] sm:text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Link2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          Project URL (Optional)
                        </Label>
                        <Input
                          value={project.url || ""}
                          onChange={(e) => updateProject(project.id, { url: e.target.value })}
                          placeholder="https://github.com/username/project"
                          type="url"
                          className="h-8 sm:h-9 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}

            {/* Empty State */}
            {data.length === 0 && (
              <div className="text-center py-8 sm:py-10 md:py-12 px-4">
                <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-teal-500/10 flex items-center justify-center mb-3 sm:mb-4">
                  <Folder className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-teal-600" />
                </div>
                <p className="text-sm sm:text-base text-muted-foreground font-medium mb-1 sm:mb-2">
                  No projects yet
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground/80 mb-3 sm:mb-4">
                  Showcase your best work and personal projects
                </p>
                <Button 
                  onClick={addProject} 
                  variant="outline" 
                  size="sm"
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                  Add Your First Project
                </Button>
              </div>
            )}
          </div>

          {/* Warning Banner */}
          {!showProjects && data.length > 0 && (
            <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <span className="shrink-0">⚠️</span>
                <span>Projects are hidden from your CV. Toggle "Show in CV" to include them.</span>
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  )
}