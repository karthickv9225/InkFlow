'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

// Mock user storage for development (bypasses Supabase rate limits)
const MOCK_USERS_KEY = 'mock_users'
const CURRENT_USER_KEY = 'current_user'

interface MockUser {
  id: string
  email: string
  password: string
  username: string
  fullName?: string
}

function getMockUsers(): MockUser[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(MOCK_USERS_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveMockUsers(users: MockUser[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
}

function setCurrentUser(user: MockUser | null) {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

function getCurrentMockUser(): MockUser | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(CURRENT_USER_KEY)
  return stored ? JSON.parse(stored) : null
}

export function useClientAuth() {
  const router = useRouter()
  const supabase = createClient()
  const USE_MOCK_AUTH = true // Set to false to use real Supabase

  const signIn = async (email: string, password: string) => {
    try {
      if (USE_MOCK_AUTH) {
        // Mock authentication
        const users = getMockUsers()
        const user = users.find(u => u.email === email && u.password === password)
        
        if (!user) {
          throw new Error('Invalid email or password')
        }
        
        setCurrentUser(user)
        toast.success('Signed in successfully!')
        return { user }
      }

      // Real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
          throw new Error('Too many login attempts. Please wait a few minutes and try again.')
        }
        throw error
      }
      return data
    } catch (err: any) {
      throw new Error(err.message || 'Failed to sign in')
    }
  }

  const signUp = async (email: string, password: string, username: string, fullName?: string) => {
    try {
      if (USE_MOCK_AUTH) {
        // Mock registration
        const users = getMockUsers()
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
          throw new Error('This email is already registered. Please login instead.')
        }
        
        if (users.some(u => u.username === username)) {
          throw new Error('This username is already taken. Please choose another.')
        }
        
        // Create new mock user
        const newUser: MockUser = {
          id: `user_${Date.now()}`,
          email,
          password,
          username,
          fullName
        }
        
        users.push(newUser)
        saveMockUsers(users)
        
        toast.success('Account created successfully! You can now login.')
        return { user: newUser }
      }

      // Real Supabase authentication
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username,
            full_name: fullName
          }
        }
      })

      if (authError) {
        if (authError.message?.includes('rate limit') || authError.message?.includes('too many')) {
          throw new Error('Too many signup attempts. Please wait a few minutes and try again.')
        }
        if (authError.message?.includes('already registered')) {
          throw new Error('This email is already registered. Please login instead.')
        }
        throw authError
      }
      
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username,
            full_name: fullName
          })
          .select()
          .single()

        if (profileError && !profileError.message?.includes('duplicate')) {
          console.error('Profile creation error:', profileError)
        }
      }
      
      return authData
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create account')
    }
  }

  const signOut = async () => {
    try {
      if (USE_MOCK_AUTH) {
        setCurrentUser(null)
        toast.success('Signed out successfully')
        router.push('/')
        router.refresh()
        return
      }

      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast.error('Failed to sign out')
        throw error
      }
      
      toast.success('Signed out successfully')
      router.push('/')
      router.refresh()
    } catch (err: any) {
      throw new Error(err.message || 'Failed to sign out')
    }
  }

  const getCurrentUser = async () => {
    try {
      if (USE_MOCK_AUTH) {
        const mockUser = getCurrentMockUser()
        if (mockUser) {
          return {
            id: mockUser.id,
            email: mockUser.email,
            user_metadata: {
              username: mockUser.username,
              full_name: mockUser.fullName
            }
          }
        }
        return null
      }

      const { data: { user } } = await supabase.auth.getUser()
      return user
    } catch (err) {
      return null
    }
  }

  return {
    signIn,
    signUp,
    signOut,
    getCurrentUser
  }
}