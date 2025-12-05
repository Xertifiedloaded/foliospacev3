"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Grid3x3, List, Flame } from "lucide-react"

import FeaturedBlog from "@/components/blog/featured-blog"
import BlogCard from "@/components/blog/blog-card"
import { Skeleton } from "@/components/ui/skeleton"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  tags: string[]
  publishedAt: string
  readTime: string
  views: number
  updatedAt?: string
  _count: {
    likes: number
    comments: number
  }
  user: {
    username: string
    name: string
    profile?: { picture?: string | null } | null
  }
  isTrending?: boolean
}

export default function BlogListClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [isGridView, setIsGridView] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState<"latest" | "recent" | "trending">("latest")
  const [isLoading, setIsLoading] = useState(true)

  /**
   * FIX: Prevent loading from ending before posts hydrate.
   */
  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      const timer = setTimeout(() => setIsLoading(false), 900)
      return () => clearTimeout(timer)
    }
  }, [initialPosts])

  /**
   * Categorization + sorting
   */
  const categorizedPosts = useMemo(() => {
    if (!initialPosts) return { trending: [], latest: [], recent: [] }

    const trending = [...initialPosts]
      .sort(
        (a, b) =>
          b.views + b._count.likes * 2 + b._count.comments * 3 -
          (a.views + a._count.likes * 2 + a._count.comments * 3),
      )
      .slice(0, 12)

    const latest = [...initialPosts].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )

    const recent = [...initialPosts].sort(
      (a, b) =>
        new Date(b.updatedAt || b.publishedAt).getTime() -
        new Date(a.updatedAt || a.publishedAt).getTime(),
    )

    return { trending, latest, recent }
  }, [initialPosts])

  const posts = categorizedPosts[category] || []

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const featuredBlog = filteredPosts[0]

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">

      {isLoading ? (
        <div className="w-full h-[420px] bg-muted/20 rounded-xl animate-pulse" />
      ) : (
        featuredBlog && <FeaturedBlog blog={featuredBlog} />
      )}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* HEADER */}
        {isLoading ? (
          <div className="mb-10">
            <Skeleton className="h-10 w-72 mb-4" />
            <Skeleton className="h-5 w-96" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Flame className="w-8 h-8 text-primary" />
              <h1 className="text-4xl sm:text-5xl font-bold">Discover Amazing Stories</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore the latest insights, trends, and developer stories.
            </p>
          </motion.div>
        )}

        {/* SEARCH */}
        {isLoading ? (
          <Skeleton className="w-full h-12 mb-6 rounded-lg" />
        ) : (
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        )}

        {/* CATEGORY & GRID/LIST TOGGLE */}
        {isLoading ? (
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-64 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex gap-2 flex-wrap">
              {(["latest", "recent", "trending"] as const).map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full font-medium transition-all capitalize ${
                    category === cat
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat === "latest" ? "🆕" : cat === "recent" ? "🕒" : "🔥"} {cat}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-2 bg-muted rounded-lg p-1">
              <motion.button
                onClick={() => setIsGridView(true)}
                whileHover={{ scale: 1.05 }}
                className={`p-2 rounded ${isGridView ? "bg-primary text-white" : "text-muted-foreground"}`}
              >
                <Grid3x3 className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => setIsGridView(false)}
                whileHover={{ scale: 1.05 }}
                className={`p-2 rounded ${!isGridView ? "bg-primary text-white" : "text-muted-foreground"}`}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        )}

        {/* POSTS LIST */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <motion.div
              key={`${isGridView}-${category}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`grid gap-6 ${
                isGridView ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {filteredPosts.map((blog, i) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <BlogCard blog={blog} isTrending={category === "trending"} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-lg text-muted-foreground">No posts found.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
