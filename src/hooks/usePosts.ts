import { useEffect, useState } from 'react'
import type { IPost } from '../types'
import { supabase } from '../lib/supabaseClient'

export const usePosts = () => {
  const [posts, setPosts] = useState<IPost[]>([])

  useEffect(() => {
    let cancelled = false
    supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (!cancelled && !error && data) setPosts(data as IPost[])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const savePost = async (data: Omit<IPost, 'id' | 'date'> & { id?: string }) => {
    if (data.id) {
      const { id, ...rest } = data
      const { data: updated, error } = await supabase
        .from('posts')
        .update(rest)
        .eq('id', id)
        .select()
        .single()
      if (!error && updated) {
        setPosts((prev) => prev.map((post) => (post.id === id ? (updated as IPost) : post)))
      } else {
        alert('Nie udało się zapisać posta.')
      }
      return
    }

    const { data: inserted, error } = await supabase.from('posts').insert(data).select().single()
    if (!error && inserted) {
      setPosts((prev) => [inserted as IPost, ...prev])
    } else {
      alert('Nie udało się zapisać posta.')
    }
  }

  const deletePost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) {
      setPosts((prev) => prev.filter((post) => post.id !== id))
    } else {
      alert('Nie udało się usunąć posta.')
    }
  }

  return { posts, savePost, deletePost }
}
