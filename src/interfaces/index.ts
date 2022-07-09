export interface FrontMatter {
  title: string
  summary: string
  topic: string
  id: string
  tags: string[]
  date: string
}

export interface Post {
  frontMatter: FrontMatter
  body: string
}

export interface Tag {
  tag: string
  count: number
}
