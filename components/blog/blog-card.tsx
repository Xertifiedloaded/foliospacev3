"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface BlogCardProps {
  blog: {
    id: string | number
    title: string
    excerpt: string
    coverImage: string
    publishedAt: string
    user: {
      name: string
      username: string
    }
    slug: string
  }
  isTrending?: boolean
}

export default function BlogCard({ blog, isTrending }: BlogCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-xl ${
        isTrending ? "animate-glow" : ""
      }`}
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <motion.img
          src={blog.coverImage || "/placeholder.svg?height=200&width=400&query=blog"}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-4">
        {isTrending && (
          <span className="inline-block py-1 rounded-full text-xs font-semibold bg-secondary/10 text-white animate-pulse">
            🔥 Trending
          </span>
        )}

        <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {blog.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{blog.user.name}</p>
            <p>
              {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <motion.a
            href={`/blog/${blog.user.username}/${blog.slug}`}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:shadow-lg transition-all"
          >
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}
