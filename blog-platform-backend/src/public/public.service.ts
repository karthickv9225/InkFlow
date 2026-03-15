import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { mockBlogsStorage } from '@/blogs/blogs.service';

export interface MockLike {
  userId: string;
  blogId: string;
}

export interface MockComment {
  id: string;
  blogId: string;
  userId: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    username: string;
  };
}

@Injectable()
export class PublicService {
  private mockLikes: Map<string, MockLike> = new Map();
  private mockComments: Map<string, MockComment> = new Map();

  constructor(private prisma: PrismaService) {}

  private generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  }

  async getFeed(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    try {
      // Try database first
      const [blogs, total] = await Promise.all([
        this.prisma.blog.findMany({
          where: { isPublished: true },
          include: {
            author: {
              select: {
                id: true,
                username: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.blog.count({
          where: { isPublished: true },
        }),
      ]);

      return {
        data: blogs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      // Fall back to mock storage
      const allBlogs = Array.from(mockBlogsStorage.values())
        .filter(blog => blog.isPublished)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const paginatedBlogs = allBlogs.slice(skip, skip + limit);
      const total = allBlogs.length;

      return {
        data: paginatedBlogs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    }
  }

  async getBlogBySlug(slug: string) {
    try {
      // Try database first
      const blog = await this.prisma.blog.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      if (!blog || !blog.isPublished) {
        throw new NotFoundException('Blog not found');
      }

      return blog;
    } catch (error) {
      // Fall back to mock storage
      const blogs = Array.from(mockBlogsStorage.values());
      const blog = blogs.find(b => b.slug === slug);

      if (!blog || !blog.isPublished) {
        throw new NotFoundException('Blog not found');
      }

      const comments = Array.from(this.mockComments.values())
        .filter(c => c.blogId === blog.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const likeCount = Array.from(this.mockLikes.values()).filter(
        l => l.blogId === blog.id,
      ).length;

      return {
        ...blog,
        comments,
        _count: {
          likes: likeCount,
        },
      };
    }
  }

  async likeBlog(blogId: string, userId: string) {
    try {
      // Try database first
      const blog = await this.prisma.blog.findUnique({
        where: { id: blogId },
      });

      if (!blog || !blog.isPublished) {
        throw new NotFoundException('Blog not found');
      }

      const existingLike = await this.prisma.like.findUnique({
        where: {
          userId_blogId: {
            userId,
            blogId,
          },
        },
      });

      if (existingLike) {
        throw new Error('Already liked');
      }

      await this.prisma.like.create({
        data: {
          userId,
          blogId,
        },
      });

      const likeCount = await this.prisma.like.count({
        where: { blogId },
      });

      return { likeCount };
    } catch (error) {
      // Fall back to mock storage
      const blog = mockBlogsStorage.get(blogId);

      if (!blog || !blog.isPublished) {
        throw new NotFoundException('Blog not found');
      }

      const likeKey = `${userId}_${blogId}`;
      if (this.mockLikes.has(likeKey)) {
        throw new Error('Already liked');
      }

      this.mockLikes.set(likeKey, { userId, blogId });

      const likeCount = Array.from(this.mockLikes.values()).filter(
        l => l.blogId === blogId,
      ).length;

      return { likeCount };
    }
  }

  async unlikeBlog(blogId: string, userId: string) {
    try {
      // Try database first
      const like = await this.prisma.like.findUnique({
        where: {
          userId_blogId: {
            userId,
            blogId,
          },
        },
      });

      if (!like) {
        throw new NotFoundException('Like not found');
      }

      await this.prisma.like.delete({
        where: {
          userId_blogId: {
            userId,
            blogId,
          },
        },
      });

      const likeCount = await this.prisma.like.count({
        where: { blogId },
      });

      return { likeCount };
    } catch (error) {
      // Fall back to mock storage
      const likeKey = `${userId}_${blogId}`;
      if (!this.mockLikes.has(likeKey)) {
        throw new NotFoundException('Like not found');
      }

      this.mockLikes.delete(likeKey);

      const likeCount = Array.from(this.mockLikes.values()).filter(
        l => l.blogId === blogId,
      ).length;

      return { likeCount };
    }
  }

  async addComment(blogId: string, userId: string, content: string): Promise<MockComment> {
    try {
      // Try database first
      const blog = await this.prisma.blog.findUnique({
        where: { id: blogId },
      });

      if (!blog || !blog.isPublished) {
        throw new NotFoundException('Blog not found');
      }

      const comment = await this.prisma.comment.create({
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
            },
          },
        },
      });

      return comment as MockComment;
    } catch (error) {
      // Fall back to mock storage
      const blog = mockBlogsStorage.get(blogId);

      if (!blog || !blog.isPublished) {
        throw new NotFoundException('Blog not found');
      }

      const commentId = this.generateId();
      const mockComment: MockComment = {
        id: commentId,
        blogId,
        userId,
        content,
        createdAt: new Date(),
        user: {
          id: userId,
          username: 'user',
        },
      };

      this.mockComments.set(commentId, mockComment);
      return mockComment;
    }
  }

  async getComments(blogId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    try {
      // Try database first
      const [comments, total] = await Promise.all([
        this.prisma.comment.findMany({
          where: { blogId },
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.comment.count({
          where: { blogId },
        }),
      ]);

      return {
        data: comments,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      // Fall back to mock storage
      const allComments = Array.from(this.mockComments.values())
        .filter(c => c.blogId === blogId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const paginatedComments = allComments.slice(skip, skip + limit);
      const total = allComments.length;

      return {
        data: paginatedComments,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    }
  }
}
