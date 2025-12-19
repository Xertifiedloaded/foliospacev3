"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { LogIn, Pencil, Trash2, X, Check, MessageCircle, Share2, Heart, NotebookIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useAuth } from '../../../hooks/useAuth'

interface BlogComment {
    id: string
    content: string
    author: string
    email: string
    createdAt: string
}

interface BlogPost {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string
    coverImage?: string
    tags: string[]
    publishedAt: string
    readTime: number
    views: number
    user: {
        id: string
        name: string
        username: string
        email: string
    }
    comments: BlogComment[]
    _count: {
        likes: number
        comments: number
    }
}

interface PostsListResponse {
    posts: BlogPost[]
    pagination: {
        currentPage: number
        totalPages: number
        totalCount: number
        hasNextPage: boolean
        hasPreviousPage: boolean
    }
}

export default function BlogSlugClient({
    params,
}: {
    params: { slug: string[] }
}) {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const { slug } = params
    const isSinglePost = slug.length === 2
    const username = slug[0]
    const postSlug = isSinglePost ? slug[1] : null

    const [post, setPost] = useState<BlogPost | null>(null)
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [profileUser, setProfileUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [editFormData, setEditFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        coverImage: "",
        tags: [] as string[],
    })
    const [newTag, setNewTag] = useState("")
    const [editError, setEditError] = useState<string | null>(null)

    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [commentName, setCommentName] = useState("")
    const [commentEmail, setCommentEmail] = useState("")
    const [commentContent, setCommentContent] = useState("")
    const [submittingComment, setSubmittingComment] = useState(false)

    const isLoggedIn = !!user
    const isOwner = !!(user && ((post && user.username === post.user.username) ||
        (profileUser && user.username === profileUser.username)))

    useEffect(() => {
        fetchData()
    }, [username, postSlug])

    async function fetchData() {
        try {
            setLoading(true)
            setError(null)

            if (isSinglePost) {
                const response = await fetch(`/api/posts/${username}/${postSlug}`)
                if (!response.ok) {
                    setError(response.status === 404 ? "Post not found" : "Failed to load post")
                    return
                }
                const data = await response.json()
                setPost(data)
                setLikeCount(data._count.likes)
                setEditFormData({
                    title: data.title,
                    excerpt: data.excerpt || "",
                    content: data.content,
                    coverImage: data.coverImage || "",
                    tags: data.tags || [],
                })
            } else {

                const response = await fetch(`/api/posts/${username}`)
                if (!response.ok) {
                    setError("User not found")
                    return
                }
                const data: PostsListResponse = await response.json()
                setPosts(data.posts || [])
                if (data.posts.length > 0) {
                    setProfileUser(data.posts[0].user)
                } else {
                    setProfileUser({ username, name: username })
                }
            }
        } catch (error) {
            console.error("Failed to fetch data:", error)
            setError("Failed to load content")
        } finally {
            setLoading(false)
        }
    }

    async function handleLike() {
        if (!post) return
        try {
            const response = await fetch(`/api/posts/${username}/${postSlug}/like`, {
                method: "POST",
            })
            if (!response.ok) throw new Error("Failed to like post")
            const data = await response.json()
            setLiked(data.liked)
            setLikeCount(data.liked ? likeCount + 1 : likeCount - 1)
        } catch (error) {
            console.error("Failed to like post:", error)
        }
    }

    async function handleSubmitComment(e: React.FormEvent) {
        e.preventDefault()
        if (!commentName.trim() || !commentEmail.trim() || !commentContent.trim()) return

        setSubmittingComment(true)
        try {
            const response = await fetch(`/api/posts/${username}/${postSlug}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    author: commentName,
                    email: commentEmail,
                    content: commentContent,
                }),
            })

            if (response.ok) {
                setCommentName("")
                setCommentEmail("")
                setCommentContent("")
                fetchData()
            }
        } catch (error) {
            console.error("Failed to post comment:", error)
        } finally {
            setSubmittingComment(false)
        }
    }

    function handleCancelEdit() {
        setIsEditing(false)
        setEditError(null)
        if (post) {
            setEditFormData({
                title: post.title,
                excerpt: post.excerpt || "",
                content: post.content,
                coverImage: post.coverImage || "",
                tags: post.tags || [],
            })
        }
    }

    async function handleSaveEdit() {
        if (!editFormData.title.trim() || !editFormData.content.trim()) {
            setEditError("Title and content are required")
            return
        }

        setIsSaving(true)
        setEditError(null)

        try {
            const response = await fetch(`/api/posts/${username}/${postSlug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: editFormData.title,
                    excerpt: editFormData.excerpt || editFormData.content.substring(0, 200),
                    content: editFormData.content,
                    coverImage: editFormData.coverImage,
                    tags: editFormData.tags,
                    isPublished: true,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to update post")
            }

            const updatedPost = await response.json()

            if (updatedPost.slug !== postSlug) {
                router.push(`/blog/${username}/${updatedPost.slug}`)
            } else {
                await fetchData()
            }

            setIsEditing(false)
        } catch (error) {
            console.error("Failed to save post:", error)
            setEditError(error instanceof Error ? error.message : "Failed to save post")
        } finally {
            setIsSaving(false)
        }
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            return
        }

        setDeleting(true)
        setEditError(null)

        try {
            const response = await fetch(`/api/posts/${username}/${postSlug}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to delete post")
            }
            router.push("/blog")
        } catch (error) {
            console.error("Failed to delete post:", error)
            setEditError(error instanceof Error ? error.message : "Failed to delete post")
            setDeleting(false)
        }
    }

    function addTag() {
        if (newTag.trim() && !editFormData.tags.includes(newTag.trim())) {
            setEditFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()],
            }))
            setNewTag("")
        }
    }

    function removeTag(tag: string) {
        setEditFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }))
    }

    // Loading state
    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-1 flex justify-center items-center">
                    <Spinner />
                </main>
                <Footer />
            </div>
        )
    }

    if (error || (!post && isSinglePost) || (!profileUser && !isSinglePost && posts.length === 0)) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-1 flex justify-center items-center">
                    <div className="text-center">
                        <p className="text-muted-foreground text-lg mb-4">{error || "Content not found"}</p>
                        <Button onClick={() => router.push("/blog")}>Go to Blog</Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!isSinglePost) {
        const displayUser = profileUser || (posts.length > 0 ? posts[0].user : null)

        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="mb-12 flex items-center justify-between border-b pb-4">
                    <p className="text-sm text-muted-foreground">
                        By <span className="font-medium text-foreground">{displayUser?.name}</span>
                    </p>

                    {isOwner && (
                        <Link href="/blog/new">
                            <Button variant="ghost" size="sm">
                                New post
                            </Button>
                        </Link>
                    )}
                </div>
                <Footer />
            </div>
        )
    }

    const publishDate = post
        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : ""

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    {editError && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
                            {editError}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mb-6">
                        {!isLoggedIn ? (
                            <Button variant="default" size="sm" onClick={() => router.push("/auth/signin")} className="gap-2">
                                <LogIn className="h-4 w-4" />
                                Login to Post
                            </Button>
                        ) : (
                            <>
                                {isOwner && (
                                    <>
                                        {isEditing ? (
                                            <>
                                                <Button variant="outline" size="sm" onClick={handleCancelEdit} className="gap-2 bg-transparent">
                                                    <X className="h-4 w-4" />
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={handleSaveEdit}
                                                    disabled={isSaving}
                                                    className="gap-2"
                                                >
                                                    <Check className="h-4 w-4" />
                                                    {isSaving ? "Saving..." : "Save"}
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Link href="/blog/new">
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        <NotebookIcon className="h-4 w-4" />
                                                        New Post
                                                    </Button>
                                                </Link>
                                                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={handleDelete}
                                                    disabled={deleting}
                                                    className="gap-2"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    {deleting ? "Deleting..." : "Delete"}
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mb-8">
                            <label className="block text-sm font-medium mb-3">Cover Image URL</label>
                            <Input
                                value={editFormData.coverImage}
                                onChange={(e) => setEditFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
                                placeholder="Enter image URL"
                            />
                        </div>
                    ) : (
                        editFormData.coverImage && (
                            <img
                                src={editFormData.coverImage}
                                alt={post!.title}
                                className="w-full h-[400px] object-cover rounded-lg mb-8"
                            />
                        )
                    )}

                    {isEditing ? (
                        <Input
                            value={editFormData.title}
                            onChange={(e) => setEditFormData((prev) => ({ ...prev, title: e.target.value }))}
                            className="text-5xl font-bold mb-6 h-auto py-4"
                            placeholder="Post title"
                        />
                    ) : (
                        <h1 className="text-2xl lg:text-5xl font-bold mb-6">{post!.title}</h1>
                    )}

                    <div className="mb-10 border-b pb-4">
                        <p className="text-sm text-muted-foreground">
                            By{" "}
                            <span className="font-medium text-foreground">
                                {post!.user.name}
                            </span>
                            {" · "}
                            <time dateTime={post!.createdAt}>
                                {publishDate}
                            </time>
                        </p>
                    </div>


                    {isEditing ? (
                        <Textarea
                            value={editFormData.excerpt}
                            onChange={(e) => setEditFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                            className="text-xl text-muted-foreground italic mb-8 leading-relaxed"
                            placeholder="Post excerpt"
                            rows={3}
                        />
                    ) : (
                        <p
                            className="
      mb-8
      text-[1.15rem]
      leading-relaxed
      tracking-wide
      text-muted-foreground
    "
                        >
                            {post.excerpt}
                        </p>
                    )}


                    {isEditing ? (
                        <Textarea
                            value={editFormData.content}
                            onChange={(e) => setEditFormData((prev) => ({ ...prev, content: e.target.value }))}
                            className="w-full mb-12 font-mono text-sm"
                            placeholder="Post content (HTML supported)"
                            rows={15}
                        />
                    ) : (
                        <article
                            className="
    prose
    prose-sm
    max-w-none
    text-sm
    leading-relaxed
    tracking-wide
    text-justify
    dark:prose-invert
    mb-12
    newspaper
    fancy-drop
  "
                        >
                            <div dangerouslySetInnerHTML={{ __html: post!.content }} />
                        </article>
                    )}

                    {isEditing && (
                        <div className="mb-8 p-4 bg-secondary/50 rounded-lg">
                            <label className="block text-sm font-medium mb-3">Tags</label>
                            <div className="flex gap-2 mb-4">
                                <Input
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                    placeholder="Add a tag and press Enter"
                                    className="flex-1"
                                />
                                <Button type="button" variant="outline" onClick={addTag} size="sm">
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {editFormData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium flex items-center gap-2"
                                    >
                                        #{tag}
                                        <button onClick={() => removeTag(tag)} className="hover:opacity-70">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {!isEditing && (
                        <>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={handleLike}
                                        className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors"
                                    >
                                        <div className={`p-2 rounded-lg ${liked ? "bg-red-500/10" : "bg-muted"}`}>
                                            <Heart className={`h-4 w-4 ${liked ? "text-red-500 fill-red-500" : ""}`} />
                                        </div>
                                        <span className="font-medium">{likeCount}</span>
                                    </button>

                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <div className="p-2 bg-blue-500/10 rounded-lg">
                                            <MessageCircle className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <span className="font-medium">{post!.comments.length}</span>
                                    </div>
                                </div>

                                <Button variant="default" size="sm">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </Button>
                            </div>

                            {post!.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {post!.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors cursor-pointer"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}


                            <section className="py-8">
                                <h2 className="text-2xl font-bold mb-6">Comments</h2>

                                <Card className="p-6 mb-8">
                                    <form onSubmit={handleSubmitComment} className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <Input
                                                placeholder="Your name"
                                                value={commentName}
                                                onChange={(e) => setCommentName(e.target.value)}
                                                required
                                            />
                                            <Input
                                                placeholder="Your email"
                                                type="email"
                                                value={commentEmail}
                                                onChange={(e) => setCommentEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Textarea
                                            placeholder="Leave a comment..."
                                            value={commentContent}
                                            onChange={(e) => setCommentContent(e.target.value)}
                                            rows={4}
                                            required
                                        />
                                        <Button type="submit" disabled={submittingComment}>
                                            {submittingComment ? "Posting..." : "Post Comment"}
                                        </Button>
                                    </form>
                                </Card>

                                {post!.comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {post!.comments.map((comment) => (
                                            <Card key={comment.id} className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-semibold">{comment.author}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm">{comment.content}</p>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="p-8 text-center text-muted-foreground">
                                        <p>No comments yet. Be the first to comment!</p>
                                    </Card>
                                )}
                            </section>

                            <Button variant="outline" onClick={() => router.push(`/blog/${post!.user.username}`)} className="mt-8">
                                ← Back to {post!.user.name}&apos;s Posts
                            </Button>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
