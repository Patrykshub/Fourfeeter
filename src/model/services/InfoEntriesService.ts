import type { SupabaseClient } from '@supabase/supabase-js'
import type { IInfoEntry } from '../../types'

export type InfoEntryInput = Omit<IInfoEntry, 'id'>

export class InfoEntriesService {
  public constructor(private readonly supabase: SupabaseClient) {}

  public async fetchEntries(): Promise<IInfoEntry[] | undefined> {
    const { data, error } = await this.supabase.from('info_entries').select('*')
    if (error || !data) {
      console.error('Failed to fetch info entries', error)
      return undefined
    }
    return data as IInfoEntry[]
  }

  public async insertEntry(data: InfoEntryInput): Promise<IInfoEntry | undefined> {
    const { data: inserted, error } = await this.supabase
      .from('info_entries')
      .insert(data)
      .select()
      .single()
    if (error || !inserted) {
      console.error('Failed to insert info entry', error)
      return undefined
    }
    return inserted as IInfoEntry
  }

  public async updateEntry(id: string, data: InfoEntryInput): Promise<IInfoEntry | undefined> {
    const { data: updated, error } = await this.supabase
      .from('info_entries')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error || !updated) {
      console.error('Failed to update info entry', error)
      return undefined
    }
    return updated as IInfoEntry
  }

  public async deleteEntry(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('info_entries').delete().eq('id', id)
    if (error) {
      console.error('Failed to delete info entry', error)
      return false
    }
    return true
  }
}
