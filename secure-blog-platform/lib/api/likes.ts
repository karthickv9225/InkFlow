import { prisma } from '@/lib/prisma'

export class LikeAPI {
  static async getBlogLikes(blogId: string) {
    const likes = await prisma.like.findMany({
      where: { blogId },
    })

    return likes
  }

  static async getUserLike(blogId: string, userId: string) {
    const like = await prisma.like.findUnique({
      where: {
        userId_blogId: {
          userId,
          blogId,
        },
      },
    })

    return like
  }

  static async likeBlog(blogId: string, userId: string) {
    const like = await prisma.like.create({
      data: {
        blogId,
        userId,
      },
    })

    // Increment blog like count
    await prisma.blog.update({
      where: { id: blogId },
      data: { likeCount: { increment: 1 } },
    })

    return like
  }

  static async unlikeBlog(blogId: string, userId: string) {
    await prisma.like.delete({
      where: {
        userId_blogId: {
          userId,
          blogId,
        },
      },
    })

    // Decrement blog like count
    await prisma.blog.update({
      where: { id: blogId },
      data: { likeCount: { decrement: 1 } },
    })
  }

  static async toggleLike(blogId: string, userId: string) {
    const existingLike = await this.getUserLike(blogId, userId)

    if (existingLike) {
      await this.unlikeBlog(blogId, userId)
      return { liked: false }
    } else {
      const like = await this.likeBlog(blogId, userId)
      return { liked: true, like }
    }
  }
}
