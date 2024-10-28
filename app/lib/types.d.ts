export type Base = {
  title: string
  description: string
  href?: string
}

export type Post = Base & {
  slug: string | undefined
  date: string
  tags: string[]
  body: string
  lastModified?: number
  views?: number
  isThirdParty?: boolean
  type: 'post'
}

export type Project = Base & {
  role: string
  years: string[]
  stars?: number
  type: 'project'
}

export type Note = Base & {
  date: string
  body: string
  slug: string
  type: 'snippet' | 'tip' | 'note'
}

export type Review = Base & {
  date: string
  body: string
  slug: string
  type: 'review'
}

