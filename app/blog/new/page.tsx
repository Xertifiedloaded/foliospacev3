"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../../hooks/useAuth"

interface PostFormData {
  title: string
  content: string
  excerpt: string
  coverImage?: File | null
  tags: string[]
  isPublished: boolean
}

export default function NewPostPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    excerpt: "",
    coverImage: null,
    tags: [],
    isPublished: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const isFormValid = formData.title.trim() && formData.content.trim()

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }

      setFormData({ ...formData, coverImage: file })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  function removeImage() {
    setFormData({ ...formData, coverImage: null })
    setImagePreview(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("content", formData.content)
      formDataToSend.append("excerpt", formData.excerpt)
      formDataToSend.append("isPublished", String(formData.isPublished))
      formDataToSend.append("tags", JSON.stringify(formData.tags))

      if (formData.coverImage) {
        formDataToSend.append("coverImage", formData.coverImage)
      }

      const response = await fetch("/api/posts/create", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create post")
      }

      const result = await response.json()
      router.push(`/blog/${result.user.username}/${result.slug}`)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred"
      setError(errorMsg)
      console.error("Create error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8 max-w-4xl mx-auto">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <p className="text-muted-foreground mt-1">Write and publish a new blog post</p>
        </div>

        {error && (
          <Card className="mb-8 p-4 bg-destructive/10 border-destructive">
            <p className="text-destructive text-sm">{error}</p>
          </Card>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter post title"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter post content (HTML supported)"
                rows={12}
                className="w-full px-3 py-2 border border-input rounded-md bg-background font-mono text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Enter post excerpt (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cover Image</label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Cover preview"
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2 gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-input rounded-md p-8 text-center">
                  <input type="file" id="coverImage" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <label htmlFor="coverImage" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload cover image</span>
                    <span className="text-xs text-muted-foreground">PNG, JPG up to 5MB</span>
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="react, javascript, web-dev"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="rounded border-input"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Publish immediately
              </label>
            </div>

            <div className="flex gap-3 justify-end">
              <Link href="/blog">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isFormValid || loading} className="gap-2">
                {loading ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  "Create Post"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}
