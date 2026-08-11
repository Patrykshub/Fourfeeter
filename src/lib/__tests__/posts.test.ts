import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../supabaseClient', () => ({
  supabase: { from: vi.fn() },
}))

import { supabase } from '../supabaseClient'
import { createPost, deletePost, fetchPosts, updatePost } from '../posts'

interface IQueryResult {
  data: unknown
  error: unknown
}

const createQueryBuilder = (result: IQueryResult) => {
  const builder: Record<string, unknown> = {
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    single: vi.fn(() => builder),
    then: (onFulfilled: (result: IQueryResult) => unknown) =>
      Promise.resolve(result).then(onFulfilled),
  }
  return builder
}

const mockFrom = supabase.from as unknown as ReturnType<typeof vi.fn>

const mockQueryResult = (result: IQueryResult) => {
  const builder = createQueryBuilder(result)
  mockFrom.mockReturnValue(builder)
  return builder
}

const post = { id: '1', title: 'Title', content: 'Content', image: 'img.png', date: '2026-01-01' }

beforeEach(() => {
  mockFrom.mockReset()
})

describe('fetchPosts', () => {
  it('returns posts ordered by the query', async () => {
    const builder = mockQueryResult({ data: [post], error: null })

    const result = await fetchPosts()

    expect(mockFrom).toHaveBeenCalledWith('posts')
    expect(builder.select).toHaveBeenCalledWith('*')
    expect(builder.order).toHaveBeenCalledWith('date', { ascending: false })
    expect(result).toEqual([post])
  })

  it('throws when supabase returns an error', async () => {
    mockQueryResult({ data: null, error: new Error('network down') })

    await expect(fetchPosts()).rejects.toThrow('network down')
  })

  it('throws when supabase returns no data and no error', async () => {
    mockQueryResult({ data: null, error: null })

    await expect(fetchPosts()).rejects.toThrow('Failed to fetch posts')
  })
})

describe('createPost', () => {
  const input = { title: 'New', content: 'Body', image: 'new.png' }

  it('inserts the post and returns the created row', async () => {
    const builder = mockQueryResult({ data: post, error: null })

    const result = await createPost(input)

    expect(mockFrom).toHaveBeenCalledWith('posts')
    expect(builder.insert).toHaveBeenCalledWith(input)
    expect(result).toEqual(post)
  })

  it('throws when supabase returns an error', async () => {
    mockQueryResult({ data: null, error: new Error('insert failed') })

    await expect(createPost(input)).rejects.toThrow('insert failed')
  })
})

describe('updatePost', () => {
  const input = { title: 'Updated', content: 'Body', image: 'updated.png' }

  it('updates the post by id and returns the updated row', async () => {
    const builder = mockQueryResult({ data: post, error: null })

    const result = await updatePost('1', input)

    expect(mockFrom).toHaveBeenCalledWith('posts')
    expect(builder.update).toHaveBeenCalledWith(input)
    expect(builder.eq).toHaveBeenCalledWith('id', '1')
    expect(result).toEqual(post)
  })

  it('throws when supabase returns an error', async () => {
    mockQueryResult({ data: null, error: new Error('update failed') })

    await expect(updatePost('1', input)).rejects.toThrow('update failed')
  })
})

describe('deletePost', () => {
  it('deletes the post by id', async () => {
    const builder = mockQueryResult({ data: null, error: null })

    await deletePost('1')

    expect(mockFrom).toHaveBeenCalledWith('posts')
    expect(builder.delete).toHaveBeenCalled()
    expect(builder.eq).toHaveBeenCalledWith('id', '1')
  })

  it('throws when supabase returns an error', async () => {
    mockQueryResult({ data: null, error: new Error('delete failed') })

    await expect(deletePost('1')).rejects.toThrow('delete failed')
  })
})
