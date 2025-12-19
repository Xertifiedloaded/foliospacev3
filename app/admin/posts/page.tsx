"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { PostEditor } from "@/components/admin/post-editor"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  coverImage?: string
  isPublished: boolean
  publishedAt?: string
  tags: string[]
  views: number
  createdAt: string
  updatedAt: string
  _count: {
    comments: number
    likes: number
  }
  user?: {
    id: string
    name: string
    username: string
    email: string
  }
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null)

  useEffect(() => {
    fetchPosts()
    fetchCurrentUser()
  }, [page])

  async function fetchCurrentUser() {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setCurrentUser(userData)
      }
    } catch (error) {
      console.error("Failed to fetch user:", error)
    }
  }

  async function fetchPosts() {
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/my-posts?page=${page}&limit=10`)
      const data = await response.json()
      setPosts(data.posts)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSavePost(formData: FormData) {
    try {
      let response

      if (editingPost && currentUser) {
        response = await fetch(`/api/posts/${currentUser.username}/${editingPost.slug}`, {
          method: "PUT",
          body: formData,
        })
      } else {
        response = await fetch("/api/posts/create", {
          method: "POST",
          body: formData,
        })
      }

      if (!response.ok) throw new Error("Failed to save post")

      setShowEditor(false)
      setEditingPost(null)
      fetchPosts()
    } catch (error) {
      throw error
    }
  }

  async function handleDeletePost(slug: string) {
    if (!confirm("Are you sure you want to delete this post?")) return

    if (!currentUser) {
      console.error("User not logged in")
      return
    }

    try {
      const response = await fetch(`/api/posts/${currentUser.username}/${slug}`, { method: "DELETE" })

      if (!response.ok) throw new Error("Failed to delete post")

      fetchPosts()
    } catch (error) {
      console.error("Failed to delete post:", error)
    }
  }

  async function handleEditPost(post: BlogPost) {
    if (!currentUser) {
      console.error("User not logged in")
      return
    }

    try {
      const response = await fetch(`/api/posts/${currentUser.username}/${post.slug}`)
      if (response.ok) {
        const fullPost = await response.json()
        setEditingPost(fullPost)
        setShowEditor(true)
      } else {
        throw new Error("Failed to fetch post")
      }
    } catch (error) {
      console.error("Failed to fetch post for editing:", error)
    }
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Blog Posts</h1>
              <p className="text-muted-foreground mt-1">Manage and create blog posts</p>
            </div>
            <Button
              onClick={() => {
                setEditingPost(null)
                setShowEditor(true)
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </div>

          {showEditor && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{editingPost ? "Edit Post" : "Create New Post"}</h2>
                <Button variant="ghost" onClick={() => setShowEditor(false)}>
                  Cancel
                </Button>
              </div>
              <PostEditor initialData={editingPost as any} onSave={handleSavePost} />
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{post.title}</h3>
                        <Badge variant={post.isPublished ? "default" : "outline"}>
                          {post.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                        <span>{post.views} views</span>
                        <span>{post._count.comments} comments</span>
                        <span>{post._count.likes} likes</span>
                        <span>
                          Updated{" "}
                          {formatDistanceToNow(new Date(post.updatedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {currentUser && (
                        <Link href={`/blog/${currentUser.username}/${post.slug}`} target="_blank">
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                        onClick={() => handleEditPost(post)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                        onClick={() => handleDeletePost(post.slug)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Previous
                  </Button>
                  <span className="text-sm flex items-center">
                    Page {page} of {totalPages}
                  </span>
                  <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              No posts yet. Create your first post to get started!
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
