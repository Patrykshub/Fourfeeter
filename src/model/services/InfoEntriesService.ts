import { app } from '../Application'
import type { IInfoEntry } from '../../types'

export type InfoEntryInput = Omit<IInfoEntry, 'id'>

export class InfoEntriesService {
  public async fetchEntries(): Promise<IInfoEntry[] | undefined> {
    const { data, error } = await app().supabase.from('info_entries').select('*')
    if (error || !data) return undefined
    return data as IInfoEntry[]
  }

  public async insertEntry(data: InfoEntryInput): Promise<IInfoEntry | undefined> {
    const { data: inserted, error } = await app()
      .supabase.from('info_entries')
      .insert(data)
      .select()
      .single()
    if (error || !inserted) return undefined
    return inserted as IInfoEntry
  }

  public async updateEntry(id: string, data: InfoEntryInput): Promise<IInfoEntry | undefined> {
    const { data: updated, error } = await app()
      .supabase.from('info_entries')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error || !updated) return undefined
    return updated as IInfoEntry
  }

  public async deleteEntry(id: string): Promise<boolean> {
    const { error } = await app().supabase.from('info_entries').delete().eq('id', id)
    return !error
  }
}
