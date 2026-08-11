import type { IPost } from '../types'
import { supabase } from './supabaseClient'

export type PostInput = Omit<IPost, 'id' | 'date'>

export const fetchPosts = async (): Promise<IPost[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false })
  if (error || !data) throw error ?? new Error('Failed to fetch posts')
  return data as IPost[]
}

export const createPost = async (data: PostInput): Promise<IPost> => {
  const { data: inserted, error } = await supabase
    .from('posts')
    .insert(data)
    .select()
    .single()
  if (error || !inserted) throw error ?? new Error('Failed to create post')
  return inserted as IPost
}

export const updatePost = async (id: string, data: PostInput): Promise<IPost> => {
  const { data: updated, error } = await supabase
    .from('posts')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error || !updated) throw error ?? new Error('Failed to update post')
  return updated as IPost
}

export const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}
