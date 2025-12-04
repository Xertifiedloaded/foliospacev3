import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import BlogListClient from "@/components/blog/blog-list-client"

async function getPosts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/posts/all-posts?limit=50`, {
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
      <BlogListClient initialPosts={posts} />
      <Footer />
    </div>
  )
}
