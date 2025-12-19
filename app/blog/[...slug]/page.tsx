
import { getPost } from "@/lib/data"
import BlogSlugClient from "./BlogSlugClient"
import type { Metadata } from "next"
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params

  if (!slug || slug.length === 1) {
    const username = slug?.[0] ?? "Blog"

    return {
      title: `Contents posted by ${username}`,
      description: `Posts by ${username}`,
      openGraph: {
        title: `Contents posted by ${username}`,
        description: `Posts by ${username}`,
      },
      twitter: {
        card: "summary",
      },
    }
  }

  const [username, postSlug] = slug
  const post = await getPost(username, postSlug)

  if (!post) {
    return {
      title: "Post not found",
      description: "The requested blog post does not exist",
    }
  }

  return {
    title: post.title,
    description: post.excerpt ?? "",
    
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? "",
      images: [
        {
          url: post.coverImage ?? "/og-default.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [post.coverImage ?? "/og-default.jpg"],
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const resolvedParams = await params
  return <BlogSlugClient params={resolvedParams} />
}
