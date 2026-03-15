'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader, Bold, Italic, List, Code, Heading2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

export default function CreateBlogPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    summary: '',
    isPublished: false,
  });

  useEffect(() => {
    useAuthStore.getState().loadFromStorage();
  }, []);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setFormData({ ...formData, slug });
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const newContent =
      formData.content.substring(0, start) +
      before +
      selectedText +
      after +
      formData.content.substring(end);

    setFormData({ ...formData, content: newContent });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        toast.error('Title is required');
        return;
      }

      if (!formData.slug.trim()) {
        toast.error('Slug is required');
        return;
      }

      if (!formData.content.trim()) {
        toast.error('Content is required');
        return;
      }

      await api.post('/blogs', {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        summary: formData.summary || undefined,
        isPublished: formData.isPublished,
      });

      toast.success('Blog created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create blog';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Write a New Blog</h1>
          <p className="text-gray-600 mt-2">Share your thoughts with the world</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title for your blog"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/200 characters
            </p>
          </div>

          {/* Slug and Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slug */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="url-slug"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Auto
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                URL-friendly slug (lowercase, hyphens only)
              </p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary (Optional)
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Brief summary of your blog post"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.summary.length}/500 characters
              </p>
            </div>
          </div>

          {/* Editor */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Toolbar */}
            <div className="border-b border-gray-200 p-4 bg-gray-50 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => insertMarkdown('**', '**')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Bold"
              >
                <Bold className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('*', '*')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Italic"
              >
                <Italic className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('## ', '')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Heading"
              >
                <Heading2 className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('- ', '')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="List"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('```\n', '\n```')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Code"
              >
                <Code className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('[Link](', ')')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Link"
              >
                <LinkIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('![Alt text](', ')')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <div className="flex-1"></div>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className={`px-4 py-2 rounded transition-colors ${
                  preview
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {preview ? 'Edit' : 'Preview'}
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6">
              {preview ? (
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {formData.content}
                  </div>
                </div>
              ) : (
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your blog content here... Markdown is supported!"
                  rows={16}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                  required
                />
              )}
            </div>
          </div>

          {/* Publish Option */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Publish immediately
              </label>
              <span className="text-xs text-gray-500">
                (You can publish later from dashboard)
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating...' : 'Create Blog'}
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Writing Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ Use a clear, descriptive title that captures the essence</li>
            <li>✓ Create a URL-friendly slug (auto-generate available)</li>
            <li>✓ Write a compelling summary to attract readers</li>
            <li>✓ Use markdown formatting for better readability</li>
            <li>✓ Save as draft first, then publish when ready</li>
            <li>✓ Use headings, lists, and code blocks for structure</li>
            <li>✓ Add links and images to enhance your content</li>
          </ul>
        </div>

        {/* Markdown Guide */}
        <div className="mt-8 bg-gray-100 border border-gray-300 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">📝 Markdown Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-medium mb-2">Formatting:</p>
              <ul className="space-y-1 font-mono text-xs">
                <li>**bold** → <strong>bold</strong></li>
                <li>*italic* → <em>italic</em></li>
                <li>## Heading → Heading</li>
                <li>- List item → List</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Advanced:</p>
              <ul className="space-y-1 font-mono text-xs">
                <li>[Link](url) → Link</li>
                <li>![Image](url) → Image</li>
                <li>```code``` → Code block</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
