"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import BlogListClient from "@/components/blog/blog-list-client"

export default function BlogPage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/posts/all-posts?limit=50")
        const data = await res.json()
        setPosts(data.posts || [])
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      }
    }

    loadPosts()
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10">
        <BlogListClient initialPosts={posts} />
      </main>

      <Footer />
    </div>
  )
}
