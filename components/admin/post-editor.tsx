"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, ImageIcon } from "lucide-react"
import Image from "next/image"

interface PostEditorProps {
  initialData?: {
    title: string
    excerpt: string
    content: string
    tags: string[]
    coverImage?: string
    isPublished: boolean
  }
  onSave: (data: FormData) => Promise<void>
  isLoading?: boolean
}

export function PostEditor({ initialData, onSave, isLoading }: PostEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [isPublished, setIsPublished] = useState(initialData?.isPublished || false)
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [error, setError] = useState("")

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string>(initialData?.coverImage || "")
  const [isDragging, setIsDragging] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        setError("File must be an image")
        return
      }
      setCoverImageFile(file)
      setCoverImagePreview(URL.createObjectURL(file))
      setError("")
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        setError("File must be an image")
        return
      }
      setCoverImageFile(file)
      setCoverImagePreview(URL.createObjectURL(file))
      setError("")
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("excerpt", excerpt || content.substring(0, 200))
      formData.append("content", content)
      formData.append("tags", JSON.stringify(tags))
      formData.append("isPublished", isPublished.toString())

      if (coverImageFile) {
        formData.append("coverImage", coverImageFile)
      }

      await onSave(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post")
    }
  }

  function addTag() {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive rounded text-sm text-destructive">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className="mt-1" />
        </div>

        <div>
          <label className="text-sm font-medium">Cover Image</label>
          <div
            className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {coverImagePreview ? (
              <div className="space-y-4">
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={coverImagePreview || "/placeholder.svg"}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCoverImageFile(null)
                    setCoverImagePreview("")
                  }}
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag and drop an image here, or click to select</p>
                <p className="text-xs text-muted-foreground">Max size: 5MB</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="cover-image-input" />
            {!coverImagePreview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 bg-transparent"
                onClick={() => document.getElementById("cover-image-input")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Excerpt</label>
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary (optional)"
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Content</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            rows={12}
            className="mt-1 font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">Supports markdown and HTML</p>
        </div>

        <div>
          <label className="text-sm font-medium">Tags</label>
          <div className="flex gap-2 mt-1">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Add a tag..."
            />
            <Button type="button" onClick={addTag} variant="outline">
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <Badge key={tag} className="gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="published" className="text-sm font-medium cursor-pointer">
            Publish this post
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Post"}
          </Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
