import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import type { IPost } from '../types'
import { app } from '../model/Application'

export const usePosts = () => {
  const intl = useIntl()
  const [posts, setPosts] = useState<IPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    app()
      .posts.fetchPosts()
      .then((data) => {
        if (!cancelled) setPosts(data)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const savePost = async (data: Omit<IPost, 'id' | 'date'> & { id?: string }) => {
    if (data.id) {
      const { id, ...rest } = data
      try {
        const updated = await app().posts.updatePost(id, rest)
        setPosts((prev) => prev.map((post) => (post.id === id ? updated : post)))
      } catch {
        alert(intl.formatMessage({ id: 'error.savePost' }))
      }
      return
    }

    try {
      const inserted = await app().posts.createPost(data)
      setPosts((prev) => [inserted, ...prev])
    } catch {
      alert(intl.formatMessage({ id: 'error.savePost' }))
    }
  }

  const deletePost = async (id: string) => {
    try {
      await app().posts.deletePost(id)
      setPosts((prev) => prev.filter((post) => post.id !== id))
    } catch {
      alert(intl.formatMessage({ id: 'error.deletePost' }))
    }
  }

  return { posts, isLoading, savePost, deletePost }
}
