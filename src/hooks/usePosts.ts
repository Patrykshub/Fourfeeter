import { useEffect, useState } from 'react'
import type { Post } from '../types'
import { supabase } from '../lib/supabaseClient'

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    let cancelled = false
    supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (!cancelled && !error && data) setPosts(data as Post[])
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function savePost(data: Omit<Post, 'id' | 'date'> & { id?: string }) {
    if (data.id) {
      const { id, ...rest } = data
      const { data: updated, error } = await supabase
        .from('posts')
        .update(rest)
        .eq('id', id)
        .select()
        .single()
      if (!error && updated) {
        setPosts((prev) => prev.map((post) => (post.id === id ? (updated as Post) : post)))
      }
      return
    }

    const { data: inserted, error } = await supabase.from('posts').insert(data).select().single()
    if (!error && inserted) {
      setPosts((prev) => [inserted as Post, ...prev])
    }
  }

  async function deletePost(id: string) {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) {
      setPosts((prev) => prev.filter((post) => post.id !== id))
    }
  }

  return { posts, savePost, deletePost }
}
