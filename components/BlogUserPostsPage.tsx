"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"

export default function BlogUserPostsPage({ username }: { username: string }) {
  const [posts, setPosts] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/blog/${username}`)
        if (!res.ok) throw new Error("User not found")
        const data = await res.json()

        setUser(data.user)
        setPosts(data.posts)
        document.title = `${data.user.name} • Blog`
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [username])

  if (loading) {
    return (
      <div className="p-10 text-center">
        <Spinner className="w-6 h-6" />
        <p className="mt-2">Loading blog...</p>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="p-10 text-center text-red-500">
        {error || "No posts found"}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">

      <h1 className="text-3xl font-bold">{user.name}'s Blog</h1>

      {/* Posts Grid */}
      <div className="grid sm:grid-cols-2 gap-6">

        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${username}/${post.slug}`}>
            <Card className="hover:shadow-md transition border">

              {post.coverImage && (
                <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
              </CardContent>

            </Card>
          </Link>
        ))}

      </div>
    </div>
  )
}
