import Link from 'next/link'
import { Calendar, User, Heart, MessageCircle, Eye } from 'lucide-react'
import { format } from 'date-fns'

interface BlogWithAuthor {
  id: string
  userId: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  isPublished: boolean
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  author: {
    id: string
    username: string
    fullName: string | null
    avatarUrl: string | null
  }
}

interface BlogCardProps {
  blog: BlogWithAuthor
  showAuthor?: boolean
}

export default function BlogCard({ blog, showAuthor = true }: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <time dateTime={blog.publishedAt?.toISOString() || blog.createdAt.toISOString()}>
              {format(new Date(blog.publishedAt || blog.createdAt), 'MMM d, yyyy')}
            </time>
          </div>
          
          {blog.isPublished ? (
            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
              Published
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
              Draft
            </span>
          )}
        </div>

        <Link href={`/blog/${blog.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-3 line-clamp-2">
            {blog.title}
          </h2>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.excerpt || blog.content.substring(0, 150) + (blog.content.length > 150 ? '...' : '')}
        </p>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-500">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{blog.likeCount}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-500">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{blog.commentCount}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-500">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{blog.viewCount}</span>
            </div>
          </div>

          {showAuthor && blog.author && (
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {blog.author.fullName || blog.author.username}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}