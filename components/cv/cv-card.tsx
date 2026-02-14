"use client"

import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Copy, Trash2, Globe2, MoreVertical, Download } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    <Card className="group hover:shadow-lg hover:border-primary/50 transition-all duration-200 overflow-hidden border-border/50">
      <CardContent className="p-0">
        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-5">
          <div className="shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
              <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base capitalize line-clamp-1 text-foreground group-hover:text-primary transition-colors mb-0.5 sm:mb-1">
              {title}
            </h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-flex items-center gap-1">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500 animate-pulse" />
                Updated {relativeTime}
              </span>
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-1 shrink-0">
            <Link href={`/cv/${id}/edit`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
              >
                <Edit className="h-4 w-4 mr-1.5" />
                <span className="text-xs font-medium">Edit</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors"
              onClick={() => onExport(id)}
            >
              <Download className="h-4 w-4 mr-1.5" />
              <span className="text-xs font-medium">PDF</span>
            </Button>

            <Link href={`/portfolio/${id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors"
              >
                <Globe2 className="h-4 w-4 mr-1.5" />
                <span className="text-xs font-medium">Portfolio</span>
              </Button>
            </Link>

            <Link href={`/cv/${id}/preview`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
              >
                <Eye className="h-4 w-4 mr-1.5" />
                <span className="text-xs font-medium">Preview</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors"
              onClick={() => onDuplicate(id)}
            >
              <Copy className="h-4 w-4 mr-1.5" />
              <span className="text-xs font-medium">Duplicate</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              <span className="text-xs font-medium">Delete</span>
            </Button>
          </div>

          <div className="lg:hidden shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-muted"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44 sm:w-48">
                <DropdownMenuItem asChild>
                  <Link href={`/cv/${id}/edit`} className="flex items-center cursor-pointer text-sm">
                    <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-blue-600" />
                    <span>Edit</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`/cv/${id}/preview`} className="flex items-center cursor-pointer text-sm">
                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-green-600" />
                    <span>Preview</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`/portfolio/${id}`} className="flex items-center cursor-pointer text-sm">
                    <Globe2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-purple-600" />
                    <span>Portfolio</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <button
                    className="flex items-center w-full text-sm"
                    onClick={() => onDuplicate(id)}
                  >
                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-amber-600" />
                    <span>Duplicate</span>
                  </button>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <button
                    className="flex items-center w-full text-sm"
                    onClick={() => onExport(id)}
                  >
                    <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-purple-600" />
                    <span>Download</span>
                  </button>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <button
                    className="flex items-center w-full text-red-600 text-sm"
                    onClick={() => onDelete(id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                    <span>Delete</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
