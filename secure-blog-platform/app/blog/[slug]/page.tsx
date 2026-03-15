import { notFound } from 'next/navigation'
import { BlogAPI } from '@/lib/api/blogs'
import { CommentAPI } from '@/lib/api/comments'
import { format } from 'date-fns'
import { Calendar, User, Eye, Heart, MessageCircle } from 'lucide-react'
import LikeButton from '@/components/LikeButton'
import CommentItem from '@/components/CommentItem'
import CommentForm from '@/components/CommentForm'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  
  try {
    const blog = await BlogAPI.getBlogBySlug(slug)
    
    // Increment view count (fire and forget)
    BlogAPI.incrementViewCount(slug).catch(console.error)
    
    const comments = await CommentAPI.getBlogComments(blog.id)

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Blog Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Calendar className="w-5 h-5" />
                  <time dateTime={blog.publishedAt?.toISOString() || blog.createdAt.toISOString()}>
                    {format(new Date(blog.publishedAt || blog.createdAt), 'MMMM d, yyyy')}
                  </time>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <User className="w-5 h-5" />
                  <span>{blog.author?.fullName || blog.author?.username}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-gray-500">
                  <Eye className="w-5 h-5" />
                  <span>{blog.viewCount + 1}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Heart className="w-5 h-5" />
                  <span>{blog.likeCount}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <MessageCircle className="w-5 h-5" />
                  <span>{blog.commentCount}</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6">{blog.title}</h1>
            
            {blog.excerpt && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-lg text-gray-700 italic">{blog.excerpt}</p>
              </div>
            )}
          </div>

          {/* Blog Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
          </div>

          {/* Blog Actions */}
          <div className="p-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <LikeButton 
                blogId={blog.id} 
                initialLikes={blog.likeCount}
              />
              
              <div className="text-sm text-gray-500">
                Last updated: {format(new Date(blog.updatedAt), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Comments ({blog.commentCount})
            </h2>
            <p className="text-gray-600 mt-2">
              Join the discussion and share your thoughts
            </p>
          </div>

          <div className="p-8">
            <CommentForm blogId={blog.id} />
            
            {comments && comments.length > 0 ? (
              <div className="mt-8 space-y-6">
                {comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            ) : (
              <div className="mt-8 text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Be the first to share your thoughts on this blog post!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}