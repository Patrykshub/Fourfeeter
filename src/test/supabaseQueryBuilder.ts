import { vi } from 'vitest'

export interface IQueryResult {
  data: unknown
  error: unknown
}

/**
 * Mimics the thenable, chainable shape of a supabase-js PostgrestBuilder:
 * every method returns the same builder, and `await`ing it (via `then`)
 * resolves to the configured result.
 */
export const createQueryBuilder = (result: IQueryResult) => {
  const builder: Record<string, unknown> = {
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    upsert: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    single: vi.fn(() => builder),
    maybeSingle: vi.fn(() => builder),
    then: (onFulfilled: (result: IQueryResult) => unknown) =>
      Promise.resolve(result).then(onFulfilled),
  }
  return builder
}
