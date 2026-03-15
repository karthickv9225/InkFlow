'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Heart, MessageCircle, Loader, User, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useAuthStore();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    useAuthStore.getState().loadFromStorage();
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/public/blogs/${slug}`);
      setBlog(response.data);
      setLikeCount(response.data._count.likes);
      setComments(response.data.comments || []);
    } catch (error) {
      toast.error('Blog not found');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      if (liked) {
        await api.delete(`/public/blogs/${blog.id}/like`);
        setLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await api.post(`/public/blogs/${blog.id}/like`);
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post(`/public/blogs/${blog.id}/comments`, {
        content: comment,
      });
      setComments([response.data, ...comments]);
      setComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <article className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

          <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{blog.author.username}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-700 whitespace-pre-wrap">{blog.content}</p>
          </div>

          <div className="flex items-center gap-6 pt-8 border-t">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                liked
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="w-5 h-5" />
              <span>{comments.length}</span>
            </div>
          </div>
        </article>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

          {user ? (
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="text-gray-600 mb-8">
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700">
                Sign in
              </Link>{' '}
              to comment
            </p>
          )}

          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-medium text-gray-900">{c.user.username}</p>
                <p className="text-sm text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mt-2">{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
