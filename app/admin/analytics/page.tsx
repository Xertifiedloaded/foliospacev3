"use client"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Eye, Heart, MessageCircle, FileText } from "lucide-react"

interface Analytics {
  totalPosts: number
  totalViews: number
  totalLikes: number
  totalComments: number
  topPosts: Array<{
    title: string
    views: number
    likes: number
  }>
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      const response = await fetch("/api/posts/my-posts")
      const data = await response.json()

      const stats = {
        totalPosts: data.pagination.totalCount,
        totalViews: data.posts.reduce((sum: number, p: any) => sum + p.views, 0),
        totalLikes: data.posts.reduce((sum: number, p: any) => sum + p._count.likes, 0),
        totalComments: data.posts.reduce((sum: number, p: any) => sum + p._count.comments, 0),
        topPosts: data.posts
          .sort((a: any, b: any) => b.views - a.views)
          .slice(0, 5)
          .map((p: any) => ({
            title: p.title,
            views: p.views,
            likes: p._count.likes,
          })),
      }

      setAnalytics(stats)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <main className="flex-1 flex justify-center items-center">
          <Spinner />
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-1">Track your blog performance</p>
          </div>

          {analytics && (
            <>
              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Posts</p>
                      <p className="text-2xl font-bold">{analytics.totalPosts}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <Eye className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                      <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <Heart className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Likes</p>
                      <p className="text-2xl font-bold">{analytics.totalLikes.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <MessageCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Comments</p>
                      <p className="text-2xl font-bold">{analytics.totalComments.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Top Posts */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Top Performing Posts</h2>
                <div className="space-y-3">
                  {analytics.topPosts.map((post, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded">
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{post.title}</p>
                      </div>
                      <div className="flex gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
