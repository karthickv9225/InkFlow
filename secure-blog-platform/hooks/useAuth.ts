'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const CURRENT_USER_KEY = 'current_user'
const USE_MOCK_AUTH = true

interface MockUser {
  id: string
  email: string
  username: string
  fullName?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      if (USE_MOCK_AUTH) {
        // Get mock user from localStorage
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(CURRENT_USER_KEY)
          if (stored) {
            const mockUser = JSON.parse(stored)
            setUser({
              id: mockUser.id,
              email: mockUser.email,
              user_metadata: {
                username: mockUser.username,
                full_name: mockUser.fullName
              }
            } as any)
          }
        }
        setLoading(false)
        return
      }

      // Real Supabase auth
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    if (!USE_MOCK_AUTH) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    }
  }, [supabase])

  return { user, loading }
}