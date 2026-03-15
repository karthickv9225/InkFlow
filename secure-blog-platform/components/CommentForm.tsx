'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { CommentAPI } from '@/lib/api/comments'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

interface CommentFormProps {
  blogId: string
  onCommentAdded?: () => void
}

export default function CommentForm({ blogId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to comment')
      return
    }

    if (!content.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    setLoading(true)
    
    try {
      await CommentAPI.createComment(blogId, user.id, content.trim())
      toast.success('Comment added successfully!')
      setContent('')
      onCommentAdded?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to add comment')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-blue-800">
          Please <a href="/login" className="font-medium underline">login</a> to leave a comment
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Add your comment
        </label>
        <textarea
          id="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={4}
          disabled={loading}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {content.length}/1000 characters
        </div>
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Posting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </>
          )}
        </button>
      </div>
    </form>
  )
}