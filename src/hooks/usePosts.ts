import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import type { IPost } from '../types'
import { supabase } from '../lib/supabaseClient'

export const usePosts = () => {
  const intl = useIntl()
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
        alert(intl.formatMessage({ id: 'error.savePost' }))
      }
      return
    }

    const { data: inserted, error } = await supabase.from('posts').insert(data).select().single()
    if (!error && inserted) {
      setPosts((prev) => [inserted as IPost, ...prev])
    } else {
      alert(intl.formatMessage({ id: 'error.savePost' }))
    }
  }

  const deletePost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) {
      setPosts((prev) => prev.filter((post) => post.id !== id))
    } else {
      alert(intl.formatMessage({ id: 'error.deletePost' }))
    }
  }

  return { posts, savePost, deletePost }
}
