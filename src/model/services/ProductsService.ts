import type { SupabaseClient } from '@supabase/supabase-js'
import type { IProduct } from '../../types'

export type ProductInput = Omit<IProduct, 'id'>

export class ProductsService {
  public constructor(private readonly supabase: SupabaseClient) {}

  public async fetchProducts(): Promise<IProduct[] | undefined> {
    const { data, error } = await this.supabase.from('products').select('*')
    if (error || !data) {
      console.error('Failed to fetch products', error)
      return undefined
    }
    return data as IProduct[]
  }

  public async insertProduct(data: ProductInput): Promise<IProduct | undefined> {
    const { data: inserted, error } = await this.supabase
      .from('products')
      .insert(data)
      .select()
      .single()
    if (error || !inserted) {
      console.error('Failed to insert product', error)
      return undefined
    }
    return inserted as IProduct
  }

  public async updateProduct(id: string, data: ProductInput): Promise<IProduct | undefined> {
    const { data: updated, error } = await this.supabase
      .from('products')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error || !updated) {
      console.error('Failed to update product', error)
      return undefined
    }
    return updated as IProduct
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('products').delete().eq('id', id)
    if (error) {
      console.error('Failed to delete product', error)
      return false
    }
    return true
  }
}
