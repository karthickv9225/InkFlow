import { prisma } from '@/lib/prisma'

export class BlogAPI {
  static async getPublishedBlogs(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [blogs, count] = await Promise.all([
      prisma.blog.findMany({
        where: { isPublished: true },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blog.count({ where: { isPublished: true } }),
    ])

    return { data: blogs, count }
  }

  static async getBlogBySlug(slug: string) {
    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    })

    if (!blog || !blog.isPublished) {
      throw new Error('Blog not found')
    }

    return blog
  }

  static async getUserBlogs(userId: string) {
    const blogs = await prisma.blog.findMany({
      where: { userId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return blogs
  }

  static async createBlog(data: {
    userId: string
    title: string
    slug: string
    content: string
  }) {
    const blog = await prisma.blog.create({
      data: {
        ...data,
        excerpt: data.content.substring(0, 150) + (data.content.length > 150 ? '...' : ''),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    })

    return blog
  }

  static async updateBlog(
    id: string,
    userId: string,
    data: {
      title?: string
      slug?: string
      content?: string
      isPublished?: boolean
    }
  ) {
    // Verify ownership
    const blog = await prisma.blog.findUnique({ where: { id } })
    if (!blog || blog.userId !== userId) {
      throw new Error('Unauthorized')
    }

    const updated = await prisma.blog.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.isPublished ? new Date() : blog.publishedAt,
        excerpt: data.content
          ? data.content.substring(0, 150) + (data.content.length > 150 ? '...' : '')
          : blog.excerpt,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    })

    return updated
  }

  static async deleteBlog(id: string, userId: string) {
    // Verify ownership
    const blog = await prisma.blog.findUnique({ where: { id } })
    if (!blog || blog.userId !== userId) {
      throw new Error('Unauthorized')
    }

    await prisma.blog.delete({ where: { id } })
  }

  static async incrementViewCount(slug: string) {
    await prisma.blog.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    })
  }
}
