'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import Link from 'next/link';
import { Loader, Heart, MessageCircle, Calendar, User } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  isPublished: boolean;
  createdAt: string;
  author: {
    id: string;
    username: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

interface FeedResponse {
  data: Blog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    useAuthStore.getState().loadFromStorage();
  }, []);

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const fetchBlogs = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await api.get<FeedResponse>('/public/feed', {
        params: { page: pageNum, limit: 10 },
      });
      setBlogs(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Feed</h1>
            <p className="text-gray-600 mt-1">Discover amazing stories from our community</p>
          </div>
          <div className="flex gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/create"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Write Blog
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your story</p>
            {user ? (
              <Link
                href="/dashboard/create"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Your First Blog
              </Link>
            ) : (
              <Link
                href="/auth/register"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Sign Up to Write
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 flex flex-col"
                >
                  {/* Header with gradient background */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                    <Link href={`/blog/${blog.slug}`}>
                      <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-3 line-clamp-2">
                        {blog.title}
                      </h2>
                    </Link>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full">
                        <User className="w-3 h-3" />
                        <span className="font-medium">{blog.author.username}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Summary */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                      {blog.summary || blog.content.substring(0, 150)}...
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-lg">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="font-semibold text-gray-900">{blog._count.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-gray-900">{blog._count.comments}</span>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      Read Full Article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-2 rounded-lg ${
                        page === p
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
