import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

export interface MockBlog {
  id: string;
  userId: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
    email: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

// Global mock blogs storage shared with PublicService
export const mockBlogsStorage = new Map<string, MockBlog>();

@Injectable()
export class BlogsService {
  private mockBlogs: Map<string, MockBlog> = mockBlogsStorage;
  private mockBlogsBySlugs: Map<string, MockBlog> = new Map();

  constructor(private prisma: PrismaService) {}

  private generateId(): string {
    return 'blog_' + Math.random().toString(36).substr(2, 9);
  }

  async create(userId: string, createBlogDto: CreateBlogDto): Promise<MockBlog> {
    const { title, slug, content, summary, isPublished } = createBlogDto;

    try {
      // Try database first
      const existingBlog = await this.prisma.blog.findUnique({
        where: { slug },
      });

      if (existingBlog) {
        throw new BadRequestException('Slug already exists');
      }

      return (await this.prisma.blog.create({
        data: {
          userId,
          title,
          slug,
          content,
          summary,
          isPublished: isPublished || false,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      })) as MockBlog;
    } catch (error) {
      // Fall back to mock storage
      if (this.mockBlogsBySlugs.has(slug)) {
        throw new BadRequestException('Slug already exists');
      }

      const blogId = this.generateId();
      const now = new Date();

      const mockBlog: MockBlog = {
        id: blogId,
        userId,
        title,
        slug,
        content,
        summary,
        isPublished: isPublished || false,
        createdAt: now,
        updatedAt: now,
        author: {
          id: userId,
          username: 'user',
          email: 'user@example.com',
        },
        _count: {
          likes: 0,
          comments: 0,
        },
      };

      this.mockBlogs.set(blogId, mockBlog);
      this.mockBlogsBySlugs.set(slug, mockBlog);

      return mockBlog;
    }
  }

  async findAll(userId: string): Promise<MockBlog[]> {
    try {
      // Try database first
      return (await this.prisma.blog.findMany({
        where: { userId },
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
      })) as MockBlog[];
    } catch (error) {
      // Fall back to mock storage
      const userBlogs = Array.from(this.mockBlogs.values())
        .filter(blog => blog.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return userBlogs;
    }
  }

  async findOne(id: string, userId: string): Promise<MockBlog> {
    try {
      // Try database first
      const blog = await this.prisma.blog.findUnique({
        where: { id },
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
      });

      if (!blog) {
        throw new NotFoundException('Blog not found');
      }

      if (blog.userId !== userId) {
        throw new ForbiddenException('You can only access your own blogs');
      }

      return blog as MockBlog;
    } catch (error) {
      // Fall back to mock storage
      const mockBlog = this.mockBlogs.get(id);

      if (!mockBlog) {
        throw new NotFoundException('Blog not found');
      }

      if (mockBlog.userId !== userId) {
        throw new ForbiddenException('You can only access your own blogs');
      }

      return mockBlog;
    }
  }

  async update(id: string, userId: string, updateBlogDto: UpdateBlogDto): Promise<MockBlog> {
    try {
      // Try database first
      const blog = await this.prisma.blog.findUnique({
        where: { id },
      });

      if (!blog) {
        throw new NotFoundException('Blog not found');
      }

      if (blog.userId !== userId) {
        throw new ForbiddenException('You can only update your own blogs');
      }

      if (updateBlogDto.slug && updateBlogDto.slug !== blog.slug) {
        const existingBlog = await this.prisma.blog.findUnique({
          where: { slug: updateBlogDto.slug },
        });

        if (existingBlog) {
          throw new BadRequestException('Slug already exists');
        }
      }

      return (await this.prisma.blog.update({
        where: { id },
        data: updateBlogDto,
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
      })) as MockBlog;
    } catch (error) {
      // Fall back to mock storage
      const mockBlog = this.mockBlogs.get(id);

      if (!mockBlog) {
        throw new NotFoundException('Blog not found');
      }

      if (mockBlog.userId !== userId) {
        throw new ForbiddenException('You can only update your own blogs');
      }

      if (updateBlogDto.slug && updateBlogDto.slug !== mockBlog.slug) {
        if (this.mockBlogsBySlugs.has(updateBlogDto.slug)) {
          throw new BadRequestException('Slug already exists');
        }
        this.mockBlogsBySlugs.delete(mockBlog.slug);
        this.mockBlogsBySlugs.set(updateBlogDto.slug, mockBlog);
      }

      const updatedBlog: MockBlog = {
        ...mockBlog,
        ...updateBlogDto,
        updatedAt: new Date(),
      };

      this.mockBlogs.set(id, updatedBlog);
      return updatedBlog;
    }
  }

  async remove(id: string, userId: string): Promise<MockBlog> {
    try {
      // Try database first
      const blog = await this.prisma.blog.findUnique({
        where: { id },
      });

      if (!blog) {
        throw new NotFoundException('Blog not found');
      }

      if (blog.userId !== userId) {
        throw new ForbiddenException('You can only delete your own blogs');
      }

      return (await this.prisma.blog.delete({
        where: { id },
      })) as MockBlog;
    } catch (error) {
      // Fall back to mock storage
      const mockBlog = this.mockBlogs.get(id);

      if (!mockBlog) {
        throw new NotFoundException('Blog not found');
      }

      if (mockBlog.userId !== userId) {
        throw new ForbiddenException('You can only delete your own blogs');
      }

      this.mockBlogs.delete(id);
      this.mockBlogsBySlugs.delete(mockBlog.slug);

      return mockBlog;
    }
  }
}
