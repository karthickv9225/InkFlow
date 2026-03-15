'use client'

import { useState } from 'react'
import { User, Edit2, Trash2, Check, X } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '@/hooks/useAuth'
import { CommentAPI } from '@/lib/api/comments'

interface CommentWithAuthor {
  id: string
  blogId: string
  userId: string
  content: string
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    username: string
    fullName: string | null
    avatarUrl: string | null
  }
}

interface CommentItemProps {
  comment: CommentWithAuthor
  onDelete?: () => void
  onUpdate?: () => void
}

export default function CommentItem({ comment, onDelete, onUpdate }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const isOwner = user?.id === comment.userId

  const handleUpdate = async () => {
    if (!isOwner || !editContent.trim()) return

    setLoading(true)
    try {
      await CommentAPI.updateComment(comment.id, comment.userId, editContent.trim())
      setIsEditing(false)
      onUpdate?.()
    } catch (error) {
      console.error('Failed to update comment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!isOwner) return

    if (window.confirm('Are you sure you want to delete this comment?')) {
      setLoading(true)
      try {
        await CommentAPI.deleteComment(comment.id, comment.userId)
        onDelete?.()
      } catch (error) {
        console.error('Failed to delete comment:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            {comment.user.avatarUrl ? (
              <img
                src={comment.user.avatarUrl}
                alt={comment.user.username}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {comment.user.fullName || comment.user.username}
            </h4>
            <p className="text-xs text-gray-500">
              {format(new Date(comment.createdAt), 'MMM d, yyyy · h:mm a')}
            </p>
          </div>
        </div>

        {isOwner && !isEditing && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit comment"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete comment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            disabled={loading}
          />
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => {
                setIsEditing(false)
                setEditContent(comment.content)
              }}
              disabled={loading}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-4 h-4 inline mr-1" />
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading || !editContent.trim()}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4 inline mr-1" />
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
      )}
    </div>
  )
}