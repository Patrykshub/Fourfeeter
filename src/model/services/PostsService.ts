import { app } from '../Application'
import type { IPost } from '../../types'

export type PostInput = Omit<IPost, 'id' | 'date'>

export class PostsService {
  public async fetchPosts(): Promise<IPost[]> {
    const { data, error } = await app()
      .supabase.from('posts')
      .select('*')
      .order('date', { ascending: false })
    if (error || !data) throw error ?? new Error('Failed to fetch posts')
    return data as IPost[]
  }

  public async createPost(data: PostInput): Promise<IPost> {
    const { data: inserted, error } = await app()
      .supabase.from('posts')
      .insert(data)
      .select()
      .single()
    if (error || !inserted) throw error ?? new Error('Failed to create post')
    return inserted as IPost
  }

  public async updatePost(id: string, data: PostInput): Promise<IPost> {
    const { data: updated, error } = await app()
      .supabase.from('posts')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error || !updated) throw error ?? new Error('Failed to update post')
    return updated as IPost
  }

  public async deletePost(id: string): Promise<void> {
    const { error } = await app().supabase.from('posts').delete().eq('id', id)
    if (error) throw error
  }
}
