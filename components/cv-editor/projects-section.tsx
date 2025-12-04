"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Project } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"

interface ProjectsSectionProps {
  data: Project[]
  onChange: (data: Project[]) => void
}

export function ProjectsSection({ data, onChange }: ProjectsSectionProps) {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      url: "",
      technologies: [],
    }
    onChange([...data, newProject])
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange(data.map((proj) => (proj.id === id ? { ...proj, ...updates } : proj)))
  }

  const removeProject = (id: string) => {
    onChange(data.filter((proj) => proj.id !== id))
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <Button onClick={addProject} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="space-y-4">
        {data.map((project) => (
          <Card key={project.id} className="p-4 bg-secondary/20">
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => removeProject(project.id)}
                className="ml-auto text-destructive hover:text-destructive/80"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3">
              <Input
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                placeholder="Project Name"
              />

              <Textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                placeholder="Project description..."
                rows={2}
              />

              <Input
                value={project.url || ""}
                onChange={(e) => updateProject(project.id, { url: e.target.value })}
                placeholder="Project URL (optional)"
              />

              <Input
                value={project.technologies.join(", ")}
                onChange={(e) =>
                  updateProject(project.id, {
                    technologies: e.target.value.split(",").map((t) => t.trim()),
                  })
                }
                placeholder="Technologies (comma-separated)"
              />
            </div>
          </Card>
        ))}

        {data.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No projects yet. Add some to showcase your work.</p>
        )}
      </div>
    </Card>
  )
}
