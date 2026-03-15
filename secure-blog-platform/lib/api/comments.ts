import { prisma } from '@/lib/prisma'

export class CommentAPI {
  static async getBlogComments(blogId: string) {
    const comments = await prisma.comment.findMany({
      where: { blogId },
      include: {
        user: {
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

    return comments
  }

  static async createComment(blogId: string, userId: string, content: string) {
    const comment = await prisma.comment.create({
      data: {
        blogId,
        userId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    })

    // Increment blog comment count
    await prisma.blog.update({
      where: { id: blogId },
      data: { commentCount: { increment: 1 } },
    })

    return comment
  }

  static async updateComment(commentId: string, userId: string, content: string) {
    // Verify ownership
    const comment = await prisma.comment.findUnique({ where: { id: commentId } })
    if (!comment || comment.userId !== userId) {
      throw new Error('Unauthorized')
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: {
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

  static async deleteComment(commentId: string, userId: string) {
    // Verify ownership
    const comment = await prisma.comment.findUnique({ where: { id: commentId } })
    if (!comment || comment.userId !== userId) {
      throw new Error('Unauthorized')
    }

    const deleted = await prisma.comment.delete({ where: { id: commentId } })

    // Decrement blog comment count
    await prisma.blog.update({
      where: { id: deleted.blogId },
      data: { commentCount: { decrement: 1 } },
    })
  }
}
