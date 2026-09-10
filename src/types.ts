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

export interface IProduct {
  id: string
  label: string
  value: string
  image: string | null
  link: string | null
}

export interface IGalleryAlbum {
  id: string
  name: string
  cover_image: string | null
}

export interface IGalleryPhoto {
  id: string
  album_id: string
  image: string
}
