import { cache } from "react"
import { prisma } from "./prisma"

export const getPost = cache(
  async (username: string, slug: string) => {
    if (!username || !slug) return null

    return prisma.blogPost.findUnique({
      where: {
        userId_slug: {
          userId: (
            await prisma.user.findUnique({
              where: { username },
              select: { id: true },
            })
          )?.id ?? "",
          slug,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        coverImage: true,
      },
    })
  }
)
