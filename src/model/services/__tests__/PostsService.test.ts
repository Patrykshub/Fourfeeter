import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createQueryBuilder, type IQueryResult } from '../../../test/supabaseQueryBuilder'

const mockFrom = vi.fn()

vi.mock('../../Application', () => ({
  app: () => ({ supabase: { from: mockFrom } }),
}))

import { PostsService } from '../PostsService'

const mockQueryResult = (result: IQueryResult) => {
  const builder = createQueryBuilder(result)
  mockFrom.mockReturnValue(builder)
  return builder
}

const post = {
  id: '1',
  title_pl: 'Tytuł',
  title_en: 'Title',
  title_de: 'Titel',
  content_pl: 'Treść',
  content_en: 'Content',
  content_de: 'Inhalt',
  image: 'img.png',
  date: '2026-01-01',
}

let posts: PostsService

beforeEach(() => {
  mockFrom.mockReset()
  posts = new PostsService()
})

describe('fetchPosts', () => {
  it('returns posts ordered by the query', async () => {
    const builder = mockQueryResult({ data: [post], error: null })

    const result = await posts.fetchPosts()

    expect(mockFrom).toHaveBeenCalledWith('posts')
    expect(builder.select).toHaveBeenCalledWith('*')
    expect(builder.order).toHaveBeenCalledWith('date', { ascending: false })
    expect(result).toEqual([post])
  })

  it('throws when supabase returns an error', async () => {
    mockQueryResult({ data: null, error: new Error('network down') })

    await expect(posts.fetchPosts()).rejects.toThrow('network down')
  })

  it('throws when supabase returns no data and no error', async () => {
    mockQueryResult({ data: null, error: null })

    await expect(posts.fetchPosts()).rejects.toThrow('Failed to fetch posts')
  })
})

describe('createPost', () => {
  const input = {
    title_pl: 'Nowy',
    title_en: 'New',
    title_de: 'Neu',
    content_pl: 'Treść',
    content_en: 'Body',
    content_de: 'Inhalt',
    image: 'new.png',
  }

  it('inserts the post and returns the created row', async () => {
    const builder = mockQueryResult({ data: post, error: null })

    const result = await posts.createPost(input)

    expect(mockFrom).toHaveBeenCalledWith('posts')
    expect(builder.insert).toHaveBeenCalledWith(input)
    expect(result).toEqual(post)
  })

  it('throws when supabase returns an error', async () => {
    mockQueryResult({ data: null, error: new Error('insert failed') })

    await expect(posts.createPost(input)).rejects.toThrow('insert failed')
  })
})

describe('updatePost', () => {
  const input = {
    title_pl: 'Zaktualizowany',
    title_en: 'Updated',
    title_de: 'Aktualisiert',
    content_pl: 'Treść',
    content_en: 'Body',
    content_de: 'Inhalt',
    image: 'updated.png',
  }

  it('updates the post by id and returns the updated row', async () => {
    const builder = mockQueryResult({ data: post, error: null })

    const result = await posts.updatePost('1', input)

    expect(mockFrom).toHaveBeenCalledWith('posts')
    expect(builder.update).toHaveBeenCalledWith(input)
    expect(builder.eq).toHaveBeenCalledWith('id', '1')
    expect(result).toEqual(post)
  })

  it('throws when supabase returns an error', async () => {
    mockQueryResult({ data: null, error: new Error('update failed') })

    await expect(posts.updatePost('1', input)).rejects.toThrow('update failed')
  })
})

describe('deletePost', () => {
  it('deletes the post by id', async () => {
    const builder = mockQueryResult({ data: null, error: null })

    await posts.deletePost('1')

    expect(mockFrom).toHaveBeenCalledWith('posts')
    expect(builder.delete).toHaveBeenCalled()
    expect(builder.eq).toHaveBeenCalledWith('id', '1')
  })

  it('throws when supabase returns an error', async () => {
    mockQueryResult({ data: null, error: new Error('delete failed') })

    await expect(posts.deletePost('1')).rejects.toThrow('delete failed')
  })
})
