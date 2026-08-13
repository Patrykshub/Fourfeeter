export interface IPost {
  id: string
  title_pl: string
  title_en: string | null
  title_de: string | null
  content_pl: string
  content_en: string | null
  content_de: string | null
  image: string
  date: string
}

export interface IInfoEntry {
  id: string
  label: string
  value: string
}
