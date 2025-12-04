import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-middleware"

type RouteParams = Promise<{ slug: string[] }>

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

function normalizeUsername(username: string): string {
  return username.toLowerCase()
}

export async function GET(request: NextRequest, props: { params: RouteParams }) {
  const params = await props.params
  const slug = params.slug

  try {
    if (slug[0] === "all-posts") {
      return await handleAllPosts(request)
    }

    if (slug[0] === "my-posts") {
      return await handleMyPosts(request)
    }

    if (slug.length === 2) {
      return await handleSinglePost(request, slug[0], slug[1])
    }
    if (slug.length === 3 && slug[2] === "comments") {
      return await handleGetComments(request, slug[0], slug[1])
    }

    if (slug.length === 1 && slug[0] !== "all-posts" && slug[0] !== "my-posts" && slug[0] !== "create") {
      return await handleUserPosts(request, slug[0])
    }

    return NextResponse.json({ error: "Route not found" }, { status: 404 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, props: { params: RouteParams }) {
  const params = await props.params
  const slug = params.slug

  try {
    if (slug[0] === "create") {
      return await handleCreatePost(request)
    }

    if (slug.length === 3 && slug[2] === "comments") {
      return await handleCreateComment(request, slug[0], slug[1])
    }
    if (slug.length === 3 && slug[2] === "like") {
      return await handleLike(request, slug[0], slug[1])
    }

    return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, props: { params: RouteParams }) {
  const params = await props.params
  const slug = params.slug

  try {
    if (slug.length === 2) {
      return await handleUpdatePost(request, slug[0], slug[1])
    }

    return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: RouteParams }) {
  const params = await props.params
  const slug = params.slug

  try {
    if (slug.length === 2) {
      return await handleDeletePost(request, slug[0], slug[1])
    }

    return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleAllPosts(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const tag = searchParams.get("tag")
  const search = searchParams.get("search")
  const sortBy = searchParams.get("sortBy") || "publishedAt"
  const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc"

  const skip = (page - 1) * limit

  const whereClause: any = {
    isPublished: true,
  }

  if (tag) {
    whereClause.tags = { has: tag }
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ]
  }

  let orderBy: any = {}
  if (sortBy === "likes") {
    orderBy = { likes: { _count: sortOrder } }
  } else if (sortBy === "views") {
    orderBy = { views: sortOrder }
  } else {
    orderBy = { [sortBy]: sortOrder }
  }

  const [posts, totalCount] = await Promise.all([
    prisma.blogPost.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        tags: true,
        publishedAt: true,
        readTime: true,
        views: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true, // Added username
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where: whereClause }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return NextResponse.json({
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  })
}

async function handleCreatePost(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, content, excerpt, coverImage, tags, isPublished } = await request.json()

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
  }

  let slug = generateSlug(title)

  const existingSlug = await prisma.blogPost.findFirst({
    where: {
      userId: user.userId,
      slug,
    },
  })

  if (existingSlug) {
    slug = `${slug}-${Date.now()}`
  }

  const readTime = calculateReadTime(content)

  const newPost = await prisma.blogPost.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + "...",
      coverImage,
      tags: tags || [],
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null,
      readTime,
      userId: user.userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true, // Added username
          email: true,
        },
      },
    },
  })

  return NextResponse.json(newPost, { status: 201 })
}

async function handleMyPosts(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const status = searchParams.get("status")

  const skip = (page - 1) * limit

  const whereClause: any = {
    userId: user.userId,
  }

  if (status === "published") {
    whereClause.isPublished = true
  } else if (status === "draft") {
    whereClause.isPublished = false
  }

  const [posts, totalCount] = await Promise.all([
    prisma.blogPost.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        tags: true,
        isPublished: true,
        publishedAt: true,
        readTime: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where: whereClause }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return NextResponse.json({
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  })
}

async function handleUserPosts(request: NextRequest, urlUsername: string) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const tag = searchParams.get("tag")
  const search = searchParams.get("search")

  const skip = (page - 1) * limit

  const normalizedUsername = normalizeUsername(urlUsername)

  const matchedUser = await prisma.user.findFirst({
    where: {
      username: {
        equals: normalizedUsername,
        mode: "insensitive",
      },
    },
    select: { id: true, username: true },
  })

  if (!matchedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const whereClause: any = {
    userId: matchedUser.id,
    isPublished: true,
  }

  if (tag) {
    whereClause.tags = { has: tag }
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ]
  }

  const [posts, totalCount] = await Promise.all([
    prisma.blogPost.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        tags: true,
        publishedAt: true,
        readTime: true,
        views: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true, // Added username
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where: whereClause }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return NextResponse.json({
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  })
}

async function handleSinglePost(request: NextRequest, urlUsername: string, postSlug: string) {
  const normalizedUsername = normalizeUsername(urlUsername)

  console.log("[v0] handleSinglePost called with:", { urlUsername, postSlug, normalizedUsername })

  const matchedUser = await prisma.user.findFirst({
    where: {
      username: {
        equals: normalizedUsername,
        mode: "insensitive",
      },
    },
    select: { id: true, username: true },
  })

  console.log("[v0] User lookup result:", matchedUser)

  if (!matchedUser) {
    const allUsers = await prisma.user.findMany({
      select: { id: true, username: true, name: true },
      take: 10,
    })
    console.log("[v0] Available users in DB:", allUsers)
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const post = await prisma.blogPost.findFirst({
    where: {
      userId: matchedUser.id,
      slug: postSlug,
      isPublished: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true, // Added username
          email: true,
        },
      },
      comments: {
        where: { parentId: null },
        include: {
          replies: {
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  })

  console.log("[v0] Post lookup result:", post ? { id: post.id, slug: post.slug } : null)

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  prisma.blogPost
    .update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    })
    .catch(console.error)

  return NextResponse.json(post)
}

async function handleUpdatePost(request: NextRequest, urlUsername: string, postSlug: string) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const normalizedUsername = normalizeUsername(urlUsername)

  const matchedUser = await prisma.user.findFirst({
    where: {
      username: {
        equals: normalizedUsername,
        mode: "insensitive",
      },
    },
    select: { id: true, username: true },
  })

  if (!matchedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const existingPost = await prisma.blogPost.findFirst({
    where: {
      userId: matchedUser.id,
      slug: postSlug,
      userId: user.userId,
    },
  })

  if (!existingPost) {
    return NextResponse.json({ error: "Post not found or unauthorized" }, { status: 404 })
  }

  const data = await request.json()

  let newSlug = postSlug
  if (data.title && data.title !== existingPost.title) {
    newSlug = generateSlug(data.title)

    const slugExists = await prisma.blogPost.findFirst({
      where: {
        userId: user.userId,
        slug: newSlug,
        id: { not: existingPost.id },
      },
    })

    if (slugExists) {
      newSlug = `${newSlug}-${Date.now()}`
    }
  }

  const updatedPost = await prisma.blogPost.update({
    where: { id: existingPost.id },
    data: {
      title: data.title || existingPost.title,
      slug: newSlug,
      content: data.content || existingPost.content,
      excerpt: data.excerpt || existingPost.excerpt,
      coverImage: data.coverImage || existingPost.coverImage,
      tags: data.tags || existingPost.tags,
      isPublished: data.isPublished !== undefined ? data.isPublished : existingPost.isPublished,
      publishedAt: data.isPublished && !existingPost.isPublished ? new Date() : existingPost.publishedAt,
      readTime: data.content ? calculateReadTime(data.content) : existingPost.readTime,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true, // Added username
          email: true,
        },
      },
    },
  })

  return NextResponse.json(updatedPost)
}

async function handleDeletePost(request: NextRequest, urlUsername: string, postSlug: string) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const normalizedUsername = normalizeUsername(urlUsername)

  const matchedUser = await prisma.user.findFirst({
    where: {
      username: {
        equals: normalizedUsername,
        mode: "insensitive",
      },
    },
    select: { id: true, username: true },
  })

  if (!matchedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const existingPost = await prisma.blogPost.findFirst({
    where: {
      userId: matchedUser.id,
      slug: postSlug,
      userId: user.userId,
    },
  })

  if (!existingPost) {
    return NextResponse.json({ error: "Post not found or unauthorized" }, { status: 404 })
  }

  await prisma.blogPost.delete({
    where: { id: existingPost.id },
  })

  return NextResponse.json({ message: "Post deleted successfully" })
}

async function handleGetComments(request: NextRequest, urlUsername: string, postSlug: string) {
  const normalizedUsername = normalizeUsername(urlUsername)

  const matchedUser = await prisma.user.findFirst({
    where: {
      username: {
        equals: normalizedUsername,
        mode: "insensitive",
      },
    },
    select: { id: true, username: true },
  })

  if (!matchedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const post = await prisma.blogPost.findFirst({
    where: {
      userId: matchedUser.id,
      slug: postSlug,
      isPublished: true,
    },
    select: { id: true },
  })

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const comments = await prisma.blogComment.findMany({
    where: {
      postId: post.id,
      parentId: null,
    },
    include: {
      replies: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(comments)
}

async function handleCreateComment(request: NextRequest, urlUsername: string, postSlug: string) {
  const { author, email, content, website, parentId } = await request.json()

  if (!author || !email || !content) {
    return NextResponse.json({ error: "Author, email, and content are required" }, { status: 400 })
  }

  const normalizedUsername = normalizeUsername(urlUsername)

  const matchedUser = await prisma.user.findFirst({
    where: {
      username: {
        equals: normalizedUsername,
        mode: "insensitive",
      },
    },
    select: { id: true, username: true },
  })

  if (!matchedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const post = await prisma.blogPost.findFirst({
    where: {
      userId: matchedUser.id,
      slug: postSlug,
      isPublished: true,
    },
    select: { id: true },
  })

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const comment = await prisma.blogComment.create({
    data: {
      author,
      email,
      content,
      website,
      postId: post.id,
      parentId: parentId || null,
    },
  })

  return NextResponse.json(comment, { status: 201 })
}

async function handleLike(request: NextRequest, urlUsername: string, postSlug: string) {
  const clientIp = request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || ""

  const normalizedUsername = normalizeUsername(urlUsername)

  const matchedUser = await prisma.user.findFirst({
    where: {
      username: {
        equals: normalizedUsername,
        mode: "insensitive",
      },
    },
    select: { id: true, username: true },
  })

  if (!matchedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const post = await prisma.blogPost.findFirst({
    where: {
      userId: matchedUser.id,
      slug: postSlug,
      isPublished: true,
    },
    select: { id: true },
  })

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const existingLike = await prisma.blogLike.findFirst({
    where: {
      postId: post.id,
      ipAddress: clientIp,
    },
  })

  if (existingLike) {
    await prisma.blogLike.delete({
      where: { id: existingLike.id },
    })

    return NextResponse.json({ message: "Post unliked", liked: false })
  } else {
    await prisma.blogLike.create({
      data: {
        postId: post.id,
        ipAddress: clientIp,
        userAgent,
      },
    })

    return NextResponse.json({ message: "Post liked", liked: true })
  }
}
