import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import type { IPost } from '../types'
import { createPost, deletePost as deletePostRequest, fetchPosts, updatePost } from '../lib/posts'

export const usePosts = () => {
  const intl = useIntl()
  const [posts, setPosts] = useState<IPost[]>([])

  useEffect(() => {
    let cancelled = false
    fetchPosts()
      .then((data) => {
        if (!cancelled) setPosts(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const savePost = async (data: Omit<IPost, 'id' | 'date'> & { id?: string }) => {
    if (data.id) {
      const { id, ...rest } = data
      try {
        const updated = await updatePost(id, rest)
        setPosts((prev) => prev.map((post) => (post.id === id ? updated : post)))
      } catch {
        alert(intl.formatMessage({ id: 'error.savePost' }))
      }
      return
    }

    try {
      const inserted = await createPost(data)
      setPosts((prev) => [inserted, ...prev])
    } catch {
      alert(intl.formatMessage({ id: 'error.savePost' }))
    }
  }

  const deletePost = async (id: string) => {
    try {
      await deletePostRequest(id)
      setPosts((prev) => prev.filter((post) => post.id !== id))
    } catch {
      alert(intl.formatMessage({ id: 'error.deletePost' }))
    }
  }

  return { posts, savePost, deletePost }
}
