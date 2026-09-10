import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { IProduct } from '../../../types'
import { createQueryBuilder } from '../../../test/supabaseQueryBuilder'
import { ProductsService } from '../ProductsService'

const mockFrom = vi.fn()

const product: IProduct = { id: '1', label: 'Food', value: 'Royal Canin', image: null, link: null }

let products: ProductsService

beforeEach(() => {
  mockFrom.mockReset()
  products = new ProductsService({ from: mockFrom } as unknown as SupabaseClient)
})

describe('fetchProducts', () => {
  it('returns the products from supabase', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: [product], error: null }))

    await expect(products.fetchProducts()).resolves.toEqual([product])
    expect(mockFrom).toHaveBeenCalledWith('products')
  })

  it('returns undefined when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('boom') }))

    await expect(products.fetchProducts()).resolves.toBeUndefined()
  })
})

describe('insertProduct', () => {
  it('inserts and returns the created product', async () => {
    const inserted: IProduct = { id: '2', label: 'Toy', value: 'Rope', image: null, link: null }
    const builder = createQueryBuilder({ data: inserted, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(
      products.insertProduct({ label: 'Toy', value: 'Rope', image: null, link: null }),
    ).resolves.toEqual(inserted)
    expect(mockFrom).toHaveBeenCalledWith('products')
    expect(builder.insert).toHaveBeenCalledWith({ label: 'Toy', value: 'Rope', image: null, link: null })
  })

  it('returns undefined when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('fail') }))

    await expect(
      products.insertProduct({ label: 'Toy', value: 'Rope', image: null, link: null }),
    ).resolves.toBeUndefined()
  })
})

describe('updateProduct', () => {
  it('updates and returns the updated product', async () => {
    const updated: IProduct = { id: '1', label: 'Food', value: 'Acana', image: null, link: null }
    const builder = createQueryBuilder({ data: updated, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(
      products.updateProduct('1', { label: 'Food', value: 'Acana', image: null, link: null }),
    ).resolves.toEqual(updated)
    expect(builder.update).toHaveBeenCalledWith({ label: 'Food', value: 'Acana', image: null, link: null })
    expect(builder.eq).toHaveBeenCalledWith('id', '1')
  })

  it('returns undefined when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('fail') }))

    await expect(
      products.updateProduct('1', { label: 'X', value: 'Y', image: null, link: null }),
    ).resolves.toBeUndefined()
  })
})

describe('deleteProduct', () => {
  it('deletes the product and returns true', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(products.deleteProduct('1')).resolves.toBe(true)
    expect(builder.eq).toHaveBeenCalledWith('id', '1')
  })

  it('returns false when supabase errors', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: new Error('fail') }))

    await expect(products.deleteProduct('1')).resolves.toBe(false)
  })
})
