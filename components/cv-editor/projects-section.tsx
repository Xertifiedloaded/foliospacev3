"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Project } from "@/lib/types"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
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
  const [isSectionExpanded, setIsSectionExpanded] = useState(false)
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
    // Auto-expand the new project
    setExpandedProjects(new Set([...expandedProjects, newProject.id]))
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
    <Card className="p-2 lg:p-6">
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsSectionExpanded(!isSectionExpanded)}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Projects</h2>
          {data.length > 0 && (
            <span className="text-sm text-muted-foreground">({data.length})</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Switch
              id="show-projects"
              checked={showProjects}
              onCheckedChange={onShowChange}
            />
            <Label htmlFor="show-projects" className="text-sm cursor-pointer">
              Show in CV
            </Label>
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              addProject()
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
            {data.map((project, index) => {
              const isExpanded = expandedProjects.has(project.id)
              const hasContent = project.name || project.description || project.url || project.technologies.length > 0

              return (
                <Card key={project.id} className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
                  {/* Accordion Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer bg-secondary/20 hover:bg-secondary/30 transition-colors"
                    onClick={() => toggleExpand(project.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {project.name || "Untitled Project"}
                        </h3>
                        {!isExpanded && project.technologies.length > 0 && (
                          <p className="text-xs text-muted-foreground truncate">
                            {project.technologies.slice(0, 3).join(", ")}
                            {project.technologies.length > 3 && "..."}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeProject(project.id)
                        }}
                        className="p-2 text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-md transition-colors"
                        title="Delete project"
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
                          Project Name *
                        </Label>
                        <Input
                          value={project.name}
                          onChange={(e) => updateProject(project.id, { name: e.target.value })}
                          placeholder="E.g., E-commerce Platform"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">
                          Description *
                        </Label>
                        <Textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, { description: e.target.value })}
                          placeholder="Describe what you built, your role, and the impact..."
                          rows={3}
                          className="resize-none"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">
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
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Separate technologies with commas
                        </p>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">
                          Project URL (Optional)
                        </Label>
                        <Input
                          value={project.url || ""}
                          onChange={(e) => updateProject(project.id, { url: e.target.value })}
                          placeholder="https://github.com/username/project"
                          type="url"
                        />
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}

            {data.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground font-medium mb-2">No projects yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Showcase your best work and personal projects
                </p>
                <Button onClick={addProject} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Project
                </Button>
              </div>
            )}
          </div>

          {!showProjects && data.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ⚠️ Projects are hidden from your CV. Toggle "Show in CV" to include them.
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  )
}