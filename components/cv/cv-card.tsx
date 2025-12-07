"use client"

import { formatDistanceToNow } from "date-fns"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Copy, Download, Trash2, Globe2 } from "lucide-react"
import Link from "next/link"
import CVTemplateButton from "./cv-template-button"

interface CVCardProps {
  id: string
  title: string
  updatedAt: string
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onExport: (id: string) => void
}

export function CVCard({ id, title, updatedAt, onDuplicate, onDelete, onExport }: CVCardProps) {
  const relativeTime = formatDistanceToNow(new Date(updatedAt), { addSuffix: true })

  return (
    <Card className="p-4 hover:shadow-md mb-2 transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold capitalize text-lg line-clamp-1 mb-1">{title}</h3>
          <p className="text-xs text-muted-foreground">
            <span className="sm:hidden">Less than a minute</span>
            <span className="hidden sm:inline">Updated {relativeTime}</span>
          </p>
        </div>
        <div className="flex items-center gap-1 sm:shrink-0">
          <Link href={`/cv/${id}/edit`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <CVTemplateButton cvId={id} />

          <Link href={`/portfolio/${id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              title="Portfolio"
            >
              <Globe2 className="h-4 w-4" />
            </Button>
          </Link>

          <Link href={`/cv/${id}/preview`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            onClick={() => onDuplicate(id)}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
