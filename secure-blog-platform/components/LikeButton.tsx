'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { LikeAPI } from '@/lib/api/likes'
import { useAuth } from '@/hooks/useAuth'

interface LikeButtonProps {
  blogId: string
  initialLikes: number
  initialLiked?: boolean
}

export default function LikeButton({ blogId, initialLikes, initialLiked = false }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(initialLiked)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleLike = async () => {
    if (!user) {
      // Redirect to login or show login modal
      return
    }

    setLoading(true)
    
    // Optimistic update
    const previousLikes = likes
    const previousLiked = liked
    
    setLikes(previousLiked ? previousLikes - 1 : previousLikes + 1)
    setLiked(!previousLiked)

    try {
      await LikeAPI.toggleLike(blogId, user.id)
    } catch (error) {
      // Revert on error
      setLikes(previousLikes)
      setLiked(previousLiked)
      console.error('Failed to toggle like:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading || !user}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        liked
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={!user ? 'Please login to like' : liked ? 'Unlike' : 'Like'}
    >
      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
      <span className="font-medium">{likes}</span>
    </button>
  )
}