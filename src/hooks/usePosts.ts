import { useEffect, useState } from 'react'
import type { Post } from '../types'
import { readJSON, writeJSON } from '../lib/storage'

const STORAGE_KEY = 'posts_v1'

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(() => {
    const stored = readJSON<Post[]>(STORAGE_KEY, [])
    return Array.isArray(stored) ? stored : []
  })

  useEffect(() => {
    writeJSON(STORAGE_KEY, posts)
  }, [posts])

  function savePost(data: Omit<Post, 'id' | 'date'> & { id?: string }) {
    if (data.id) {
      const { id } = data
      setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, ...data, id } : post)))
    } else {
      const newPost: Post = { id: crypto.randomUUID(), date: new Date().toISOString(), ...data }
      setPosts((prev) => [newPost, ...prev])
    }
  }

  function deletePost(id: string) {
    setPosts((prev) => prev.filter((post) => post.id !== id))
  }

  return { posts, savePost, deletePost }
}
