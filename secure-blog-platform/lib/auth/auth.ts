import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Server-side only functions
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

export async function getProfile(userId: string) {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data
}

export async function createProfile(userId: string, username: string, fullName?: string) {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      username,
      full_name: fullName
    })
    .select()
    .single()

  if (error) throw error
  return data
}