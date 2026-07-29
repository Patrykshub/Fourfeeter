import type { PostCategory } from './components/CategorySelect'

export type Post = {
  id: string
  title: string
  content: string
  image: string
  category: PostCategory
  date: string
}
