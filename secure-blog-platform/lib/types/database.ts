export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blogs: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          is_published: boolean
          view_count: number
          like_count: number
          comment_count: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          is_published?: boolean
          view_count?: number
          like_count?: number
          comment_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          is_published?: boolean
          view_count?: number
          like_count?: number
          comment_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          blog_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          blog_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          blog_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          blog_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          blog_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          blog_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_excerpt: {
        Args: {
          content: string
          length?: number
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}