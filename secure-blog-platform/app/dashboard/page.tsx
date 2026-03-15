import { requireAuth } from '@/lib/auth/auth'
import { BlogAPI } from '@/lib/api/blogs'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { format } from 'date-fns'

export default async function DashboardPage() {
  const user = await requireAuth()
  const blogs = await BlogAPI.getUserBlogs(user.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user.email?.split('@')[0]}! Manage your blogs here.
            </p>
          </div>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Blog
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Blogs</h2>
          <p className="text-sm text-gray-600 mt-1">
            {blogs?.length || 0} blog{blogs?.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {blogs && blogs.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <div key={blog.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{blog.title}</h3>
                      {blog.isPublished ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                          <Eye className="w-3 h-3 mr-1" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Slug: <code className="bg-gray-100 px-1 py-0.5 rounded">{blog.slug}</code>
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Created: {format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                      <span>Views: {blog.viewCount}</span>
                      <span>Likes: {blog.likeCount}</span>
                      <span>Comments: {blog.commentCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View blog"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/dashboard/edit/${blog.id}`}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit blog"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete blog"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Start sharing your thoughts with the world. Create your first blog post!
            </p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Blog
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total Blogs</p>
              <p className="text-2xl font-bold text-gray-900">{blogs?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs?.filter(b => b.isPublished).length || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs?.reduce((sum, blog) => sum + blog.viewCount, 0) || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Getting Started</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <p className="text-gray-700">
                <span className="font-medium">Create a blog</span> - Click the "Create New Blog" button to start writing
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <p className="text-gray-700">
                <span className="font-medium">Add content</span> - Write your blog post with our rich text editor
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <p className="text-gray-700">
                <span className="font-medium">Publish</span> - Make your blog public for everyone to read
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <span className="text-xs font-medium text-blue-600">4</span>
              </div>
              <p className="text-gray-700">
                <span className="font-medium">Engage</span> - Respond to comments and track your blog's performance
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}