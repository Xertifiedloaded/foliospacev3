export const dynamic = "force-dynamic"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import BlogListClient from "@/components/blog/blog-list-client"

async function getPosts() {
  try {
    const response = await fetch(`/api/posts/all-posts?limit=50`, {
      cache: "no-store",
    })

    if (!response.ok) return []

    const data = await response.json()
    return data.posts || []
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <BlogListClient initialPosts={posts} />
      </main>

      <Footer />
    </div>
  )
}
