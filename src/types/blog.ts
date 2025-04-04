export interface Author {
  name: string
  picture: string
  bio?: string
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
  }
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  author: Author
  excerpt: string
  content: string
  coverImage: string
  readingTime: string
  tags: string[]
  ogImage: {
    url: string
  }
}

export interface BlogCategory {
  name: string
  slug: string
  description: string
  count: number
}

export interface BlogTag {
  name: string
  slug: string
  count: number
}

export interface BlogArchive {
  year: number
  month: number
  count: number
  posts: BlogPost[]
}

export interface BlogStats {
  totalPosts: number
  categories: BlogCategory[]
  tags: BlogTag[]
  archives: BlogArchive[]
}
